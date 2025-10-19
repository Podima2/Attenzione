// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title Station
 * @notice Individual station contract storing report CIDs and AI safety scores
 */
contract Station {
    
    // ==================== STATE ====================
    
    string public stationId;
    string public name;
    string public metro;
    string public ensName;
    address public factory;
    
    string[] public reportCIDs;
    uint256 public aiSafetyScore; // 0-100
    uint256 public lastUpdated;
    
    // ==================== EVENTS ====================
    
    event ReportAdded(string cid, uint256 timestamp);
    event SafetyScoreUpdated(uint256 newScore, uint256 timestamp);
    
    // ==================== MODIFIERS ====================
    
    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call");
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    
    constructor(
        string memory _stationId,
        string memory _name,
        string memory _metro,
        string memory _ensName
    ) {
        stationId = _stationId;
        name = _name;
        metro = _metro;
        ensName = _ensName;
        factory = msg.sender;
        aiSafetyScore = 50; // Default neutral score
        lastUpdated = block.timestamp;
    }
    
    // ==================== FUNCTIONS ====================
    
    /**
     * @notice Add a report CID to this station
     */
    function addReportCID(string memory _cid) external onlyFactory {
        reportCIDs.push(_cid);
        lastUpdated = block.timestamp;
        emit ReportAdded(_cid, block.timestamp);
    }
    
    /**
     * @notice Update AI safety score
     */
    function updateSafetyScore(uint256 _score) external onlyFactory {
        require(_score <= 100, "Score must be 0-100");
        aiSafetyScore = _score;
        lastUpdated = block.timestamp;
        emit SafetyScoreUpdated(_score, block.timestamp);
    }
    
    /**
     * @notice Get all report CIDs
     */
    function getReportCIDs() external view returns (string[] memory) {
        return reportCIDs;
    }
    
    /**
     * @notice Get report count
     */
    function getReportCount() external view returns (uint256) {
        return reportCIDs.length;
    }
    
    /**
     * @notice Get recent reports (last N)
     */
    function getRecentReports(uint256 _count) external view returns (string[] memory) {
        uint256 length = reportCIDs.length;
        if (_count > length) _count = length;
        
        string[] memory recent = new string[](_count);
        for (uint256 i = 0; i < _count; i++) {
            recent[i] = reportCIDs[length - _count + i];
        }
        return recent;
    }
}