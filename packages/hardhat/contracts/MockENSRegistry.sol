// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title MockENSRegistry
 * @notice Simple ENS-like registry mapping names to addresses
 */
contract MockENSRegistry {
    
    // ==================== STATE ====================
    
    address public owner;
    
    mapping(string => address) public names; // ensName => contract address
    string[] public registeredNames;
    
    // ==================== EVENTS ====================
    
    event NameRegistered(string ensName, address contractAddress);
    event NameUpdated(string ensName, address newAddress);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // ==================== MODIFIERS ====================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    
    constructor() {
        owner = msg.sender;
    }
    
    // ==================== FUNCTIONS ====================
    
    /**
     * @notice Register a name
     */
    function registerName(string memory _ensName, address _address) 
        external 
        onlyOwner 
    {
        require(_address != address(0), "Invalid address");
        require(names[_ensName] == address(0), "Name already registered");
        
        names[_ensName] = _address;
        registeredNames.push(_ensName);
        
        emit NameRegistered(_ensName, _address);
    }
    
    /**
     * @notice Update an existing name
     */
    function updateName(string memory _ensName, address _newAddress) 
        external 
        onlyOwner 
    {
        require(_newAddress != address(0), "Invalid address");
        require(names[_ensName] != address(0), "Name not registered");
        
        names[_ensName] = _newAddress;
        
        emit NameUpdated(_ensName, _newAddress);
    }
    
    /**
     * @notice Resolve a name to an address
     */
    function resolve(string memory _ensName) 
        external 
        view 
        returns (address) 
    {
        address resolved = names[_ensName];
        require(resolved != address(0), "Name not found");
        return resolved;
    }
    
    /**
     * @notice Check if a name is registered
     */
    function isRegistered(string memory _ensName) 
        external 
        view 
        returns (bool) 
    {
        return names[_ensName] != address(0);
    }
    
    /**
     * @notice Get all registered names
     */
    function getAllNames() external view returns (string[] memory) {
        return registeredNames;
    }
    
    /**
     * @notice Get registered name count
     */
    function getNameCount() external view returns (uint256) {
        return registeredNames.length;
    }
    
    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}