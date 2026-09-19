import { CivicReport } from '../types';

export const SAMPLE_REPORTS: CivicReport[] = [
  {
    id: 'BCW-2026-000101',
    title: '[DEMO DATA] Severe Potholes and Submerged Culvert on Dhanmondi Road 27',
    description: 'During moderate rainfall, the main culvert connection at Dhanmondi Road 27 (Mirpur Road junction) overflows, creating a 3-foot deep crater that traps rickshaws, ambulances, and commuters. Local shopkeepers have placed makeshift bamboo sticks to prevent fatal sinkholes.',
    category: 'road',
    severity: 'high',
    status: 'action_taken',
    privacy: 'public',
    location: {
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
      unionOrArea: 'Ward 15',
      addressDescription: 'Intersection of Road 27 (Old) & Mirpur Road, near Asad Gate link',
      latitude: 23.7540,
      longitude: 90.3762,
      isApproximate: false
    },
    organizationInvolved: 'Dhaka South City Corporation & WASA Drainage Division',
    submittedAt: '2026-03-01T09:30:00Z',
    updatedAt: '2026-03-08T14:20:00Z',
    reporterName: 'Resident Civic Forum',
    evidence: [
      {
        id: 'ev-1',
        name: 'dhanmondi_crater_flood.jpg',
        fileType: 'image',
        fileSize: '3.1 MB',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        uploadedAt: '2026-03-01T09:31:00Z'
      },
      {
        id: 'ev-2',
        name: 'traffic_jam_video_proof.mp4',
        fileType: 'video',
        fileSize: '12.4 MB',
        url: '#',
        uploadedAt: '2026-03-01T09:32:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'sh-1',
        status: 'submitted',
        changedBy: 'Citizen Reporter',
        userRole: 'citizen',
        timestamp: '2026-03-01T09:30:00Z',
        comment: 'Initial citizen report submitted with geotagged photo evidence.'
      },
      {
        id: 'sh-2',
        status: 'verified',
        changedBy: 'Moderator Team (Zone-2)',
        userRole: 'moderator',
        timestamp: '2026-03-02T11:15:00Z',
        comment: 'Verified with secondary on-ground photos; forwarded to DSCC Zone-2 Engineering Section.'
      },
      {
        id: 'sh-3',
        status: 'action_taken',
        changedBy: 'DSCC Zone-2 Executive Engineer',
        userRole: 'authority',
        timestamp: '2026-03-08T14:20:00Z',
        comment: 'Temporary brick filling and dewatering pump deployed. Permanent asphalt overlay scheduled under fiscal tender.'
      }
    ],
    officialResponse: {
      id: 'res-1',
      authorityName: 'Dhaka South City Corporation (DSCC)',
      officialTitle: 'Executive Engineer (Civil Zone-2)',
      department: 'Engineering Department, DSCC',
      responseText: 'The road depression has been secured with reinforced stone-dust and rapid asphalt curing. A motorized 6-inch suction pump has cleared the stagnant ponding. Tender notice DSCC/26/CW-41 has been drafted for total box-culvert reconstruction.',
      actionTakenDetails: 'Excavation completed, culvert grates unblocked, temporary road leveling done.',
      referenceNo: 'DSCC/ENG/Z2/2026-089',
      respondedAt: '2026-03-08T14:20:00Z'
    },
    comments: [
      {
        id: 'com-1',
        userId: 'u-1',
        userName: 'Shamsul Haque (Local Resident)',
        userRole: 'citizen',
        comment: 'We saw the road maintenance crew working late Saturday night. The water drained out by morning. Appreciate the quick coordination!',
        createdAt: '2026-03-09T08:00:00Z',
        isOfficial: false
      }
    ],
    upvotesCount: 42,
    isBookmarked: true
  },
  {
    id: 'BCW-2026-000102',
    title: '[DEMO DATA] Allegation of Unauthorized Speed Money Demand for Land Mutation (Namjari)',
    description: 'A citizen alleges that an intermediary desk clerk at an auxiliary land office demanded an unofficial fee of BDT 15,000 to release digital mutation papers that were already formally approved by the Assistant Commissioner (Land). Citizen was threatened with delay without payment.',
    category: 'bribery',
    severity: 'critical',
    status: 'under_review',
    privacy: 'anonymous_public',
    location: {
      division: 'Khulna',
      district: 'Bagerhat',
      upazila: 'Bagerhat Sadar',
      unionOrArea: 'Karapara Union',
      addressDescription: 'Sub-Office near Bagerhat Collectorate Circle (Approximate Area)',
      latitude: 22.6580,
      longitude: 89.7820,
      isApproximate: true
    },
    organizationInvolved: 'Land Administration (Auxiliary Service Desk)',
    submittedAt: '2026-03-05T16:45:00Z',
    updatedAt: '2026-03-06T10:00:00Z',
    reporterName: 'Anonymous Citizen',
    evidence: [
      {
        id: 'ev-3',
        name: 'namjari_application_receipt.pdf',
        fileType: 'pdf',
        fileSize: '420 KB',
        url: '#',
        uploadedAt: '2026-03-05T16:46:00Z'
      },
      {
        id: 'ev-4',
        name: 'audio_recording_clerk_demand.m4a',
        fileType: 'audio',
        fileSize: '1.8 MB',
        url: '#',
        uploadedAt: '2026-03-05T16:47:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'sh-4',
        status: 'submitted',
        changedBy: 'Anonymous Citizen',
        userRole: 'anonymous',
        timestamp: '2026-03-05T16:45:00Z',
        comment: 'Anonymous report lodged via secure encrypted form. Reporter opted for approximate geolocation for whistleblower protection.'
      },
      {
        id: 'sh-5',
        status: 'under_review',
        changedBy: 'Integrity Compliance Officer',
        userRole: 'moderator',
        timestamp: '2026-03-06T10:00:00Z',
        comment: 'Audio evidence and official receipt validated. Escalated to District Anti-Corruption Taskforce liaison.'
      }
    ],
    comments: [],
    upvotesCount: 88,
    isBookmarked: false
  },
  {
    id: 'BCW-2026-000103',
    title: '[DEMO DATA] Hazardous Exposed High-Voltage Transformer Near Primary School',
    description: 'An open 11kV electrical distribution transformer has broken fencing and exposed grounding wires directly adjacent to the entrance gate of a government primary school. During monsoon thunderstorms, sparks have been observed dropping on the pedestrian pathway.',
    category: 'electricity',
    severity: 'critical',
    status: 'forwarded_to_authority',
    privacy: 'public',
    location: {
      division: 'Chattogram',
      district: 'Chattogram',
      upazila: 'Panchlaish',
      unionOrArea: 'Muradpur',
      addressDescription: 'Near Gate No. 2, Government Model Primary School',
      latitude: 22.3640,
      longitude: 91.8240,
      isApproximate: false
    },
    organizationInvolved: 'Bangladesh Power Development Board (BPDB - Distribution South)',
    submittedAt: '2026-03-06T11:10:00Z',
    updatedAt: '2026-03-07T09:30:00Z',
    reporterName: 'Parent-Teacher Association',
    evidence: [
      {
        id: 'ev-5',
        name: 'exposed_wires_transformer.jpg',
        fileType: 'image',
        fileSize: '4.2 MB',
        url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        uploadedAt: '2026-03-06T11:11:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'sh-6',
        status: 'submitted',
        changedBy: 'PTA Committee',
        userRole: 'citizen',
        timestamp: '2026-03-06T11:10:00Z',
        comment: 'Urgent hazard report filed with location coordinates.'
      },
      {
        id: 'sh-7',
        status: 'verified',
        changedBy: 'Field Moderator CMP Area',
        userRole: 'moderator',
        timestamp: '2026-03-06T14:00:00Z',
        comment: 'High risk to 400+ schoolchildren confirmed.'
      },
      {
        id: 'sh-8',
        status: 'forwarded_to_authority',
        changedBy: 'Super Admin',
        userRole: 'admin',
        timestamp: '2026-03-07T09:30:00Z',
        comment: 'Transmitted via Priority Emergency Dispatch to BPDB Chattogram Control Room.'
      }
    ],
    comments: [
      {
        id: 'com-2',
        userId: 'u-5',
        userName: 'Panchlaish Model Thana Duty Desk',
        userRole: 'authority',
        comment: 'Panchlaish Thana mobile patrol has placed temporary warning cordons around the transformer fence while waiting for BPDB technical crew.',
        createdAt: '2026-03-07T12:00:00Z',
        isOfficial: true
      }
    ],
    upvotesCount: 65,
    isBookmarked: true
  },
  {
    id: 'BCW-2026-000104',
    title: '[DEMO DATA] Illegal Industrial Effluent Dumping into Local Canal',
    description: 'Late at night between 1:00 AM and 4:00 AM, untreated chemical dye wastewater is discharged into the regional drainage canal, causing unbearable sulfuric stench, respiratory distress among children, and killing local fish stock.',
    category: 'environment',
    severity: 'high',
    status: 'under_review',
    privacy: 'public',
    location: {
      division: 'Dhaka',
      district: 'Gazipur',
      upazila: 'Gazipur Sadar',
      unionOrArea: 'Konabari Ward 8',
      addressDescription: 'Canal canalization point behind industrial cluster near bypass',
      latitude: 24.0042,
      longitude: 90.3951,
      isApproximate: true
    },
    organizationInvolved: 'Department of Environment (DoE Gazipur) & City Corporation',
    submittedAt: '2026-03-07T02:30:00Z',
    updatedAt: '2026-03-08T11:00:00Z',
    reporterName: 'Environmental Youth Action',
    evidence: [
      {
        id: 'ev-6',
        name: 'black_water_discharge.jpg',
        fileType: 'image',
        fileSize: '2.8 MB',
        url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
        uploadedAt: '2026-03-07T02:32:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'sh-9',
        status: 'submitted',
        changedBy: 'Youth Action',
        userRole: 'citizen',
        timestamp: '2026-03-07T02:30:00Z',
        comment: 'Timestamped chemical discharge images submitted.'
      },
      {
        id: 'sh-10',
        status: 'under_review',
        changedBy: 'DoE Monitoring Cell',
        userRole: 'moderator',
        timestamp: '2026-03-08T11:00:00Z',
        comment: 'Reviewing water quality parameters with mobile enforcement squad.'
      }
    ],
    comments: [],
    upvotesCount: 53,
    isBookmarked: false
  },
  {
    id: 'BCW-2026-000105',
    title: '[DEMO DATA] Overflowing Open Garbage Dump Blocking Hospital Access Road',
    description: 'Municipal waste containers at Bondor Bazar have remained uncollected for 5 days. Rotting organic waste has spilled across two vehicle lanes, preventing ambulances from entering the regional health complex efficiently.',
    category: 'waste_management',
    severity: 'medium',
    status: 'resolved',
    privacy: 'public',
    location: {
      division: 'Sylhet',
      district: 'Sylhet',
      upazila: 'Sylhet Sadar',
      unionOrArea: 'Bondor Bazar',
      addressDescription: 'Main Hospital Road opposite Central Post Office',
      latitude: 24.8920,
      longitude: 91.8690,
      isApproximate: false
    },
    organizationInvolved: 'Sylhet City Corporation (SCC) Waste Management Wing',
    submittedAt: '2026-02-25T08:15:00Z',
    updatedAt: '2026-02-27T16:00:00Z',
    reporterName: 'Civic Volunteer Network',
    evidence: [
      {
        id: 'ev-7',
        name: 'overflowing_bins_hospital.jpg',
        fileType: 'image',
        fileSize: '3.4 MB',
        url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
        uploadedAt: '2026-02-25T08:16:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'sh-11',
        status: 'submitted',
        changedBy: 'Volunteer Network',
        userRole: 'citizen',
        timestamp: '2026-02-25T08:15:00Z',
        comment: 'Waste accumulation report filed.'
      },
      {
        id: 'sh-12',
        status: 'verified',
        changedBy: 'SCC Monitoring Cell',
        userRole: 'moderator',
        timestamp: '2026-02-25T11:00:00Z',
        comment: 'Verified with hospital administration.'
      },
      {
        id: 'sh-13',
        status: 'resolved',
        changedBy: 'Sylhet City Corporation Conservancy Officer',
        userRole: 'authority',
        timestamp: '2026-02-27T16:00:00Z',
        comment: 'Garbage compactors deployed. Secondary dump cleared and lime disinfectant applied.'
      }
    ],
    officialResponse: {
      id: 'res-2',
      authorityName: 'Sylhet City Corporation (SCC)',
      officialTitle: 'Chief Conservancy Officer',
      department: 'Waste Management Division',
      responseText: 'The backlog was caused by a mechanical breakdown of two hydraulic compactor trucks. Both units were repaired, and the Bondor Bazar transfer spot has been fully cleared, sanitized, and placed on double daily clearing shifts.',
      actionTakenDetails: '14 tons of waste evacuated; secondary compactor scheduled for 6:00 AM and 6:00 PM daily.',
      referenceNo: 'SCC/WMD/2026-112',
      respondedAt: '2026-02-27T16:00:00Z'
    },
    comments: [],
    upvotesCount: 71,
    isBookmarked: false
  },
  {
    id: 'BCW-2026-000106',
    title: '[DEMO DATA] Sub-standard Brickwork on Rural Connecting Culvert Bridge',
    description: 'Newly laid culvert wing walls in Fakirhat Upazila have cracked within 3 weeks of construction. Local villagers noticed third-grade hollow bricks and low-ratio cement mortar being used contrary to official design specifications.',
    category: 'infrastructure',
    severity: 'high',
    status: 'needs_info',
    privacy: 'public',
    location: {
      division: 'Khulna',
      district: 'Bagerhat',
      upazila: 'Fakirhat',
      unionOrArea: 'Piljanga Union',
      addressDescription: 'Connecting road near Piljanga High School',
      latitude: 22.7750,
      longitude: 89.7120,
      isApproximate: false
    },
    organizationInvolved: 'Local Government Engineering Department (LGED)',
    submittedAt: '2026-03-04T13:00:00Z',
    updatedAt: '2026-03-06T15:00:00Z',
    reporterName: 'Piljanga Village Committee',
    evidence: [
      {
        id: 'ev-8',
        name: 'cracked_culvert_wingwall.jpg',
        fileType: 'image',
        fileSize: '1.9 MB',
        url: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
        uploadedAt: '2026-03-04T13:02:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'sh-14',
        status: 'submitted',
        changedBy: 'Village Committee',
        userRole: 'citizen',
        timestamp: '2026-03-04T13:00:00Z',
        comment: 'Report filed with photo of structural cracks.'
      },
      {
        id: 'sh-15',
        status: 'needs_info',
        changedBy: 'LGED Quality Inspector',
        userRole: 'moderator',
        timestamp: '2026-03-06T15:00:00Z',
        comment: 'Please provide the project signboard photo showing the LGED package contract number and contractor details.'
      }
    ],
    comments: [],
    upvotesCount: 39,
    isBookmarked: true
  }
];
