// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title CrimeRegistry
 * @notice Smart contract for recording and managing crime reports across metro systems
 * @dev Designed for The Graph indexing and cross-metro analysis
 */

contract CrimeRegistry {
    
    // ==================== STRUCTS ====================
    
    struct Station {
        string id;                    // e.g., "termini-rome"
        string name;                  // Human readable name
        string metro;                 // e.g., "rome"
        string lines;                 // Comma-separated lines (e.g., "A,B,C")
        uint256 lineOrder;            // Order on the line (for visualization)
        bool active;
        uint256 createdAt;
    }
    
    struct CrimeReport {
        uint256 id;
        string stationId;
        address reporter;             // Address(0) for anonymous
        uint8 severity;               // 0-10 scale
        string description;
        uint256 timestamp;
        bool verified;                // true if user paid gas themselves
    }
    
    // ==================== STATE VARIABLES ====================
    
    address public owner;
    
    // Station storage
    mapping(string => Station) public stations;           // stationId => Station
    mapping(string => bool) public stationExists;
    string[] public stationIds;
    
    // Crime reports storage
    mapping(uint256 => CrimeReport) public reports;       // reportId => CrimeReport
    mapping(string => uint256[]) public stationReports;   // stationId => reportIds
    uint256 public reportCount;
    
    // Rate limiting for anonymous reports
    mapping(address => uint256) public lastReportTime;    // ip/address => timestamp
    mapping(address => uint256) public reportCountToday;  // ip/address => count
    
    // ==================== EVENTS ====================
    
    event StationCreated(
        string stationId,
        string name,
        string metro
    );
    
    event StationUpdated(string indexed stationId);
    
    event CrimeReportSubmitted(
        uint256 indexed reportId,
        string stationId,
        address indexed reporter,
        uint8 severity,
        uint256 timestamp,
        bool verified,
        string cid
    );
    
    event AnonymousReportSubmitted(
        uint256 indexed reportId,
        string stationId,
        uint8 severity,
        uint256 timestamp,
        string cid
    );
    
    // ==================== MODIFIERS ====================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier stationMustExist(string memory _stationId) {
        require(stationExists[_stationId], "Station does not exist");
        _;
    }
    
    modifier validSeverity(uint8 _severity) {
        require(_severity >= 0 && _severity <= 10, "Severity must be 0-10");
        _;
    }
    
    modifier validDescription(string memory _description) {
        bytes memory descBytes = bytes(_description);
        require(descBytes.length >= 5 && descBytes.length <= 500, "Description must be 5-500 chars");
        _;
    }
    
    modifier rateLimit(address _address) {
        uint256 timeSinceLastReport = block.timestamp - lastReportTime[_address];
        require(timeSinceLastReport >= 5 minutes, "Rate limit: wait 5 mins between reports");
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    
    constructor() {
        owner = msg.sender;
        reportCount = 0;
    }
    
    // ==================== STATION MANAGEMENT ====================
    
    /**
     * @notice Create a new metro station
     * @param _stationId Unique identifier (e.g., "termini-rome")
     * @param _name Human-readable station name
     * @param _metro Metro system identifier (e.g., "rome")
     * @param _lines Comma-separated line codes (e.g., "A,B,C")
     * @param _lineOrder Order on the primary line for visualization
     */
    function createStation(
        string memory _stationId,
        string memory _name,
        string memory _metro,
        string memory _lines,
        uint256 _lineOrder
    ) external onlyOwner {
        require(!stationExists[_stationId], "Station already exists");
        require(bytes(_stationId).length > 0, "Station ID cannot be empty");
        
        stations[_stationId] = Station({
            id: _stationId,
            name: _name,
            metro: _metro,
            lines: _lines,
            lineOrder: _lineOrder,
            active: true,
            createdAt: block.timestamp
        });
        
        stationExists[_stationId] = true;
        stationIds.push(_stationId);
        
        emit StationCreated(_stationId, _name, _metro);
    }
    
    /**
     * @notice Deactivate a station (soft delete)
     */
    function deactivateStation(string memory _stationId) 
        external 
        onlyOwner 
        stationMustExist(_stationId) 
    {
        stations[_stationId].active = false;
        emit StationUpdated(_stationId);
    }
    
    /**
     * @notice Reactivate a station
     */
    function activateStation(string memory _stationId) 
        external 
        onlyOwner 
        stationMustExist(_stationId) 
    {
        stations[_stationId].active = true;
        emit StationUpdated(_stationId);
    }
    
    // ==================== CRIME REPORTING ====================
    
    /**
     * @notice Submit a verified crime report (user pays gas, signed by reporter)
     * @param _stationId Station identifier
     * @param _severity Severity level 0-10
     * @param _description Report description
     * @param _cid IPFS CID of the report
     */
    function submitVerifiedReport(
        string memory _stationId,
        uint8 _severity,
        string memory _description,
        string memory _cid
    ) 
        external 
        stationMustExist(_stationId)
        validSeverity(_severity)
        validDescription(_description)
        returns (uint256)
    {
        require(stations[_stationId].active, "Station is not active");
        
        uint256 reportId = reportCount;
        reportCount++;
        
        CrimeReport memory newReport = CrimeReport({
            id: reportId,
            stationId: _stationId,
            reporter: msg.sender,
            severity: _severity,
            description: _description,
            timestamp: block.timestamp,
            verified: true
        });
        
        reports[reportId] = newReport;
        stationReports[_stationId].push(reportId);
        
        emit CrimeReportSubmitted(
            reportId,
            _stationId,
            msg.sender,
            _severity,
            block.timestamp,
            true,
            _cid
        );
        
        return reportId;
    }
    
    /**
     * @notice Submit an anonymous crime report (backend/relayer pays gas)
     * @param _stationId Station identifier
     * @param _severity Severity level 0-10
     * @param _description Report description
     * @param _cid IPFS CID of the report
     * @dev Only owner (backend relayer) can call this for anonymous reports
     * @dev This is for guest reports where you (the owner) pay the gas
     */
    function submitAnonymousReport(
        string memory _stationId,
        uint8 _severity,
        string memory _description,
        string memory _cid
    ) 
        external 
        onlyOwner
        stationMustExist(_stationId)
        validSeverity(_severity)
        validDescription(_description)
        returns (uint256)
    {
        require(stations[_stationId].active, "Station is not active");
        
        uint256 reportId = reportCount;
        reportCount++;
        
        CrimeReport memory newReport = CrimeReport({
            id: reportId,
            stationId: _stationId,
            reporter: address(0),                // Anonymous
            severity: _severity,
            description: _description,
            timestamp: block.timestamp,
            verified: false
        });
        
        reports[reportId] = newReport;
        stationReports[_stationId].push(reportId);
        
        emit AnonymousReportSubmitted(
            reportId,
            _stationId,
            _severity,
            block.timestamp,
            _cid
        );
        
        return reportId;
    }
    
    // ==================== QUERIES ====================
    
    /**
     * @notice Get all stations
     */
    function getAllStations() 
        external 
        view 
        returns (Station[] memory) 
    {
        Station[] memory allStations = new Station[](stationIds.length);
        for (uint256 i = 0; i < stationIds.length; i++) {
            allStations[i] = stations[stationIds[i]];
        }
        return allStations;
    }
    
    /**
     * @notice Get a specific station
     */
    function getStation(string memory _stationId) 
        external 
        view 
        stationMustExist(_stationId)
        returns (Station memory) 
    {
        return stations[_stationId];
    }
    
    /**
     * @notice Get all reports for a station
     */
    function getStationReports(string memory _stationId) 
        external 
        view 
        stationMustExist(_stationId)
        returns (CrimeReport[] memory) 
    {
        uint256[] memory reportIds = stationReports[_stationId];
        CrimeReport[] memory stationCrimeReports = new CrimeReport[](reportIds.length);
        
        for (uint256 i = 0; i < reportIds.length; i++) {
            stationCrimeReports[i] = reports[reportIds[i]];
        }
        
        return stationCrimeReports;
    }
    
    /**
     * @notice Get a specific report
     */
    function getReport(uint256 _reportId) 
        external 
        view 
        returns (CrimeReport memory) 
    {
        require(_reportId < reportCount, "Report does not exist");
        return reports[_reportId];
    }
    
    /**
     * @notice Get number of reports for a station
     */
    function getStationReportCount(string memory _stationId) 
        external 
        view 
        stationMustExist(_stationId)
        returns (uint256) 
    {
        return stationReports[_stationId].length;
    }
    
    /**
     * @notice Get total number of stations
     */
    function getStationCount() 
        external 
        view 
        returns (uint256) 
    {
        return stationIds.length;
    }
    
    /**
     * @notice Get total number of reports
     */
    function getTotalReportCount() 
        external 
        view 
        returns (uint256) 
    {
        return reportCount;
    }
}