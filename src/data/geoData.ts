import { Division, District, Upazila } from '../types';

export const DIVISIONS: Division[] = [
  { id: 'dhaka', name: 'Dhaka', banglaName: 'ঢাকা', latitude: 23.8103, longitude: 90.4125 },
  { id: 'chattogram', name: 'Chattogram', banglaName: 'চট্টগ্রাম', latitude: 22.3569, longitude: 91.7832 },
  { id: 'rajshahi', name: 'Rajshahi', banglaName: 'রাজশাহী', latitude: 24.3745, longitude: 88.6042 },
  { id: 'khulna', name: 'Khulna', banglaName: 'খুলনা', latitude: 22.8456, longitude: 89.5403 },
  { id: 'barishal', name: 'Barishal', banglaName: 'বরিশাল', latitude: 22.7010, longitude: 90.3535 },
  { id: 'sylhet', name: 'Sylhet', banglaName: 'সিলেট', latitude: 24.8949, longitude: 91.8687 },
  { id: 'rangpur', name: 'Rangpur', banglaName: 'রংপুর', latitude: 25.7439, longitude: 89.2752 },
  { id: 'mymensingh', name: 'Mymensingh', banglaName: 'ময়মনসিংহ', latitude: 24.7471, longitude: 90.4203 },
];

export const DISTRICTS: District[] = [
  // Dhaka Division
  { id: 'dhaka-dist', divisionId: 'dhaka', name: 'Dhaka', banglaName: 'ঢাকা', latitude: 23.8103, longitude: 90.4125 },
  { id: 'gazipur', divisionId: 'dhaka', name: 'Gazipur', banglaName: 'গাজীপুর', latitude: 23.9999, longitude: 90.4203 },
  { id: 'narayanganj', divisionId: 'dhaka', name: 'Narayanganj', banglaName: 'নারায়ণগঞ্জ', latitude: 23.6238, longitude: 90.5000 },
  { id: 'tangail', divisionId: 'dhaka', name: 'Tangail', banglaName: 'টাঙ্গাইল', latitude: 24.2513, longitude: 89.9167 },
  { id: 'faridpur', divisionId: 'dhaka', name: 'Faridpur', banglaName: 'ফরিদপুর', latitude: 23.6071, longitude: 89.8429 },
  
  // Chattogram Division
  { id: 'chattogram-dist', divisionId: 'chattogram', name: 'Chattogram', banglaName: 'চট্টগ্রাম', latitude: 22.3569, longitude: 91.7832 },
  { id: 'coxsbazar', divisionId: 'chattogram', name: "Cox's Bazar", banglaName: 'কক্সবাজার', latitude: 21.4272, longitude: 92.0058 },
  { id: 'cumilla', divisionId: 'chattogram', name: 'Cumilla', banglaName: 'কুমিল্লা', latitude: 23.4607, longitude: 91.1809 },
  { id: 'noakhali', divisionId: 'chattogram', name: 'Noakhali', banglaName: 'নোয়াখালী', latitude: 22.8696, longitude: 91.0995 },
  
  // Rajshahi Division
  { id: 'rajshahi-dist', divisionId: 'rajshahi', name: 'Rajshahi', banglaName: 'রাজশাহী', latitude: 24.3745, longitude: 88.6042 },
  { id: 'bogura', divisionId: 'rajshahi', name: 'Bogura', banglaName: 'বগুড়া', latitude: 24.8465, longitude: 89.3777 },
  { id: 'pabna', divisionId: 'rajshahi', name: 'Pabna', banglaName: 'পাবনা', latitude: 24.0116, longitude: 89.2444 },
  
  // Khulna Division
  { id: 'khulna-dist', divisionId: 'khulna', name: 'Khulna', banglaName: 'খুলনা', latitude: 22.8456, longitude: 89.5403 },
  { id: 'bagerhat', divisionId: 'khulna', name: 'Bagerhat', banglaName: 'বাগেরহাট', latitude: 22.6516, longitude: 89.7859 },
  { id: 'jessore', divisionId: 'khulna', name: 'Jashore', banglaName: 'যশোর', latitude: 23.1664, longitude: 89.2081 },
  { id: 'kushtia', divisionId: 'khulna', name: 'Kushtia', banglaName: 'কুষ্টিয়া', latitude: 23.9013, longitude: 89.1205 },
  
  // Barishal Division
  { id: 'barishal-dist', divisionId: 'barishal', name: 'Barishal', banglaName: 'বরিশাল', latitude: 22.7010, longitude: 90.3535 },
  { id: 'patuakhali', divisionId: 'barishal', name: 'Patuakhali', banglaName: 'পটুয়াখালী', latitude: 22.3596, longitude: 90.3299 },
  
  // Sylhet Division
  { id: 'sylhet-dist', divisionId: 'sylhet', name: 'Sylhet', banglaName: 'সিলেট', latitude: 24.8949, longitude: 91.8687 },
  { id: 'moulvibazar', divisionId: 'sylhet', name: 'Moulvibazar', banglaName: 'মৌলভীবাজার', latitude: 24.4829, longitude: 91.7774 },
  
  // Rangpur Division
  { id: 'rangpur-dist', divisionId: 'rangpur', name: 'Rangpur', banglaName: 'রংপুর', latitude: 25.7439, longitude: 89.2752 },
  { id: 'dinajpur', divisionId: 'rangpur', name: 'Dinajpur', banglaName: 'দিনাজপুর', latitude: 25.6217, longitude: 88.6355 },
  
  // Mymensingh Division
  { id: 'mymensingh-dist', divisionId: 'mymensingh', name: 'Mymensingh', banglaName: 'ময়মনসিংহ', latitude: 24.7471, longitude: 90.4203 },
  { id: 'jamalpur', divisionId: 'mymensingh', name: 'Jamalpur', banglaName: 'জামালপুর', latitude: 24.9375, longitude: 89.9378 }
];

export const UPAZILAS: Upazila[] = [
  // Dhaka
  { id: 'dhanmondi', districtId: 'dhaka-dist', name: 'Dhanmondi', banglaName: 'ধানমন্ডি' },
  { id: 'gulshan', districtId: 'dhaka-dist', name: 'Gulshan', banglaName: 'গুলশান' },
  { id: 'mirpur', districtId: 'dhaka-dist', name: 'Mirpur', banglaName: 'মিরপুর' },
  { id: 'ramna', districtId: 'dhaka-dist', name: 'Ramna', banglaName: 'রমনা' },
  { id: 'motijheel', districtId: 'dhaka-dist', name: 'Motijheel', banglaName: 'মতিঝিল' },
  { id: 'uttara', districtId: 'dhaka-dist', name: 'Uttara', banglaName: 'উত্তরা' },
  { id: 'savar', districtId: 'dhaka-dist', name: 'Savar', banglaName: 'সাভার' },
  { id: 'keraniganj', districtId: 'dhaka-dist', name: 'Keraniganj', banglaName: 'কেরানীগঞ্জ' },

  // Gazipur
  { id: 'gazipur-sadar', districtId: 'gazipur', name: 'Gazipur Sadar', banglaName: 'গাজীপুর সদর' },
  { id: 'kaliakair', districtId: 'gazipur', name: 'Kaliakair', banglaName: 'কালিয়াকৈর' },
  { id: 'sreepur', districtId: 'gazipur', name: 'Sreepur', banglaName: 'শ্রীপুর' },

  // Chattogram
  { id: 'chattogram-kotwali', districtId: 'chattogram-dist', name: 'Kotwali', banglaName: 'কোতোয়ালী' },
  { id: 'panchlaish', districtId: 'chattogram-dist', name: 'Panchlaish', banglaName: 'পাঁচলাইশ' },
  { id: 'pahartali', districtId: 'chattogram-dist', name: 'Pahartali', banglaName: 'পাহাড়তলী' },
  { id: 'hathazari', districtId: 'chattogram-dist', name: 'Hathazari', banglaName: 'হাটহাজারী' },

  // Bagerhat
  { id: 'bagerhat-sadar', districtId: 'bagerhat', name: 'Bagerhat Sadar', banglaName: 'বাগেরহাট সদর' },
  { id: 'mongla', districtId: 'bagerhat', name: 'Mongla', banglaName: 'মংলা' },
  { id: 'fakirhat', districtId: 'bagerhat', name: 'Fakirhat', banglaName: 'ফকিরহাট' },
  { id: 'rampall', districtId: 'bagerhat', name: 'Rampal', banglaName: 'রামপাল' },

  // Khulna
  { id: 'khulna-sadar', districtId: 'khulna-dist', name: 'Khulna Sadar', banglaName: 'খুলনা সদর' },
  { id: 'daulatpur', districtId: 'khulna-dist', name: 'Daulatpur', banglaName: 'দৌলতপুর' },
  { id: 'dumuria', districtId: 'khulna-dist', name: 'Dumuria', banglaName: 'ডুমুরিয়া' },

  // Sylhet
  { id: 'sylhet-sadar', districtId: 'sylhet-dist', name: 'Sylhet Sadar', banglaName: 'সিলেট সদর' },
  { id: 'shah-paran', districtId: 'sylhet-dist', name: 'Shah Paran', banglaName: 'শাহ পরান' },
  { id: 'beanibazar', districtId: 'sylhet-dist', name: 'Beanibazar', banglaName: 'বিয়ানীবাজার' },

  // Rajshahi
  { id: 'boalia', districtId: 'rajshahi-dist', name: 'Boalia', banglaName: 'বোয়ালিয়া' },
  { id: 'motihar', districtId: 'rajshahi-dist', name: 'Motihar', banglaName: 'মতিহার' },
  { id: 'paba', districtId: 'rajshahi-dist', name: 'Paba', banglaName: 'পবা' },

  // Bogura
  { id: 'bogura-sadar', districtId: 'bogura', name: 'Bogura Sadar', banglaName: 'বগুড়া সদর' },
  { id: 'shibganj', districtId: 'bogura', name: 'Shibganj', banglaName: 'শিবগঞ্জ' },

  // Rangpur
  { id: 'rangpur-sadar', districtId: 'rangpur-dist', name: 'Rangpur Sadar', banglaName: 'রংপুর সদর' },
  { id: 'mithapukur', districtId: 'rangpur-dist', name: 'Mithapukur', banglaName: 'মিঠাপুকুর' },

  // Barishal
  { id: 'barishal-sadar', districtId: 'barishal-dist', name: 'Barishal Sadar', banglaName: 'বরিশাল সদর' },
  { id: 'babuganj', districtId: 'barishal-dist', name: 'Babuganj', banglaName: 'বাবুগঞ্জ' }
];
