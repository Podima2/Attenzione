// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Station.sol";
import "./MockENSRegistry.sol";

/**
 * @title StationFactory
 * @notice Deploys Station contracts and registers ENS names
 */
contract StationFactory {
    
    // ==================== STATE ====================
    
    address public owner;
    MockENSRegistry public ensRegistry;
    
    mapping(string => address) public stations; // stationId => Station contract
    string[] public stationIds;
    
    // ==================== EVENTS ====================
    
    event StationDeployed(
        string stationId,
        string name,
        string ensName,
        address stationContract
    );
    
    // ==================== MODIFIERS ====================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    
    constructor(address _ensRegistry) {
        owner = msg.sender;
        ensRegistry = MockENSRegistry(_ensRegistry);
    }
    
    // ==================== FUNCTIONS ====================
    
    /**
     * @notice Deploy a new station contract and register ENS name
     */
    function deployStation(
        string memory _stationId,
        string memory _name,
        string memory _metro,
        string memory _ensName
    ) external onlyOwner returns (address) {
        require(stations[_stationId] == address(0), "Station exists");
        
        // Deploy Station contract
        Station station = new Station(_stationId, _name, _metro, _ensName);
        address stationAddress = address(station);
        
        // Store mapping
        stations[_stationId] = stationAddress;
        stationIds.push(_stationId);
        
        // Register in mock ENS
        ensRegistry.registerName(_ensName, stationAddress);
        
        emit StationDeployed(_stationId, _name, _ensName, stationAddress);
        
        return stationAddress;
    }

    function registerENSName(string memory _ensName, address _address) 
        external 
        onlyOwner 
    {
        ensRegistry.registerName(_ensName, _address);
    }
    
    /**
     * @notice Add report CID to a station
     */
    function addReportToStation(
        string memory _stationId,
        string memory _cid
    ) external {
        address stationAddress = stations[_stationId];
        require(stationAddress != address(0), "Station not found");
        
        Station(stationAddress).addReportCID(_cid);
    }
    
    /**
     * @notice Update safety score for a station
     */
    function updateStationSafetyScore(
        string memory _stationId,
        uint256 _score
    ) external onlyOwner {
        address stationAddress = stations[_stationId];
        require(stationAddress != address(0), "Station not found");
        
        Station(stationAddress).updateSafetyScore(_score);
    }
    
    /**
     * @notice Get station contract address by ID
     */
    function getStationAddress(string memory _stationId) 
        external 
        view 
        returns (address) 
    {
        return stations[_stationId];
    }
    
    /**
     * @notice Get all station IDs
     */
    function getAllStationIds() external view returns (string[] memory) {
        return stationIds;
    }
    
    /**
     * @notice Get station count
     */
    function getStationCount() external view returns (uint256) {
        return stationIds.length;
    }
}