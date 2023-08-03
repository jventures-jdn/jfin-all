export default [
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'constructorParams',
                type: 'bytes',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'staker',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'epoch',
                type: 'uint64',
            },
        ],
        name: 'Claimed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'staker',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'epoch',
                type: 'uint64',
            },
        ],
        name: 'Delegated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'staker',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'epoch',
                type: 'uint64',
            },
        ],
        name: 'Undelegated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'status',
                type: 'uint8',
            },
            {
                indexed: false,
                internalType: 'uint16',
                name: 'commissionRate',
                type: 'uint16',
            },
        ],
        name: 'ValidatorAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'epoch',
                type: 'uint64',
            },
        ],
        name: 'ValidatorJailed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'status',
                type: 'uint8',
            },
            {
                indexed: false,
                internalType: 'uint16',
                name: 'commissionRate',
                type: 'uint16',
            },
        ],
        name: 'ValidatorModified',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'epoch',
                type: 'uint64',
            },
        ],
        name: 'ValidatorOwnerClaimed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
        ],
        name: 'ValidatorRemoved',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint32',
                name: 'slashes',
                type: 'uint32',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'epoch',
                type: 'uint64',
            },
        ],
        name: 'ValidatorSlashed',
        type: 'event',
    },
    {
        inputs: [],
        name: 'getChainConfig',
        outputs: [
            {
                internalType: 'contract IChainConfig',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getGovernance',
        outputs: [
            {
                internalType: 'contract IGovernance',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getSlashingIndicator',
        outputs: [
            {
                internalType: 'contract ISlashingIndicator',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getStaking',
        outputs: [
            {
                internalType: 'contract IStaking',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getStakingPool',
        outputs: [
            {
                internalType: 'contract IStakingPool',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getSystemContracts',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getSystemReward',
        outputs: [
            {
                internalType: 'contract ISystemReward',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'init',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'contract IStaking',
                name: 'stakingContract',
                type: 'address',
            },
            {
                internalType: 'contract ISlashingIndicator',
                name: 'slashingIndicatorContract',
                type: 'address',
            },
            {
                internalType: 'contract ISystemReward',
                name: 'systemRewardContract',
                type: 'address',
            },
            {
                internalType: 'contract IStakingPool',
                name: 'stakingPoolContract',
                type: 'address',
            },
            {
                internalType: 'contract IGovernance',
                name: 'governanceContract',
                type: 'address',
            },
            {
                internalType: 'contract IChainConfig',
                name: 'chainConfigContract',
                type: 'address',
            },
            {
                internalType: 'contract IRuntimeUpgrade',
                name: 'runtimeUpgradeContract',
                type: 'address',
            },
            {
                internalType: 'contract IDeployerProxy',
                name: 'deployerProxyContract',
                type: 'address',
            },
        ],
        name: 'initManually',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'isInitialized',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'validators',
                type: 'address[]',
            },
            {
                internalType: 'uint256[]',
                name: 'initialStakes',
                type: 'uint256[]',
            },
            {
                internalType: 'uint16',
                name: 'commissionRate',
                type: 'uint16',
            },
        ],
        name: 'ctor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'delegator',
                type: 'address',
            },
        ],
        name: 'getValidatorDelegation',
        outputs: [
            {
                internalType: 'uint256',
                name: 'delegatedAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint64',
                name: 'atEpoch',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
        ],
        name: 'getValidatorStatus',
        outputs: [
            {
                internalType: 'address',
                name: 'ownerAddress',
                type: 'address',
            },
            {
                internalType: 'uint8',
                name: 'status',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'totalDelegated',
                type: 'uint256',
            },
            {
                internalType: 'uint32',
                name: 'slashesCount',
                type: 'uint32',
            },
            {
                internalType: 'uint64',
                name: 'changedAt',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: 'jailedBefore',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: 'claimedAt',
                type: 'uint64',
            },
            {
                internalType: 'uint16',
                name: 'commissionRate',
                type: 'uint16',
            },
            {
                internalType: 'uint96',
                name: 'totalRewards',
                type: 'uint96',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'epoch',
                type: 'uint64',
            },
        ],
        name: 'getValidatorStatusAtEpoch',
        outputs: [
            {
                internalType: 'address',
                name: 'ownerAddress',
                type: 'address',
            },
            {
                internalType: 'uint8',
                name: 'status',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'totalDelegated',
                type: 'uint256',
            },
            {
                internalType: 'uint32',
                name: 'slashesCount',
                type: 'uint32',
            },
            {
                internalType: 'uint64',
                name: 'changedAt',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: 'jailedBefore',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: 'claimedAt',
                type: 'uint64',
            },
            {
                internalType: 'uint16',
                name: 'commissionRate',
                type: 'uint16',
            },
            {
                internalType: 'uint96',
                name: 'totalRewards',
                type: 'uint96',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'getValidatorByOwner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
        ],
        name: 'releaseValidatorFromJail',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
        ],
        name: 'delegate',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'undelegate',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'currentEpoch',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'nextEpoch',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'uint16',
                name: 'commissionRate',
                type: 'uint16',
            },
        ],
        name: 'registerValidator',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'addValidator',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'removeValidator',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
        ],
        name: 'activateValidator',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validator',
                type: 'address',
            },
        ],
        name: 'disableValidator',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'uint16',
                name: 'commissionRate',
                type: 'uint16',
            },
        ],
        name: 'changeValidatorCommissionRate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'changeValidatorOwner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'isValidatorActive',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'isValidator',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getValidators',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
        ],
        name: 'deposit',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
        ],
        name: 'getValidatorFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
        ],
        name: 'getPendingValidatorFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
        ],
        name: 'claimValidatorFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'beforeEpoch',
                type: 'uint64',
            },
        ],
        name: 'claimValidatorFeeAtEpoch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'delegatorAddress',
                type: 'address',
            },
        ],
        name: 'getDelegatorFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'delegatorAddress',
                type: 'address',
            },
        ],
        name: 'getPendingDelegatorFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
        ],
        name: 'claimDelegatorFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: 'beforeEpoch',
                type: 'uint64',
            },
        ],
        name: 'claimDelegatorFeeAtEpoch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'validatorAddress',
                type: 'address',
            },
        ],
        name: 'slash',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const
