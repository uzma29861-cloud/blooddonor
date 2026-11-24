import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  DEFAULT_HOSPITALS,
  INITIAL_BLOOD_BANKS,
  INITIAL_DONORS,
  INITIAL_BUDDY_CIRCLES,
  INITIAL_PLANNED_SURGERIES,
  INITIAL_COMMUNITY_CAMPS,
  INITIAL_PAST_DONATIONS,
  INITIAL_DONOR_HEALTH_VAULT,
  INITIAL_NEAR_EXPIRY_STOCK,
  INITIAL_CITY_DEMAND_PREDICTOR,
  calculateDistanceKm,
  generateRoutePoints,
} from '../utils/mockBackend';
import { isCompatible } from '../utils/compatibility';
import {
  playEmergencyAlertSound,
  playSuccessChime,
  playEscalationSiren,
} from '../utils/soundEffects';

const AppContext = createContext();

const STORAGE_KEY = 'lifepulse_state_v1';
const BROADCAST_CHANNEL_NAME = 'lifepulse_broadcast_channel';

export function AppProvider({ children }) {
  // Theme state: 'crimson' | 'teal' | 'blue' | 'dark'
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('lifepulse_theme') || 'crimson';
  });

  useEffect(() => {
    document.documentElement.className = `theme-${currentTheme}`;
    localStorage.setItem('lifepulse_theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (newTheme) => {
    document.documentElement.className = `theme-${newTheme}`;
    localStorage.setItem('lifepulse_theme', newTheme);
    setCurrentTheme(newTheme);
  };

  // Multilingual & User settings
  const [language, setLanguage] = useState(() => localStorage.getItem('lifepulse_lang') || 'en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(() => !localStorage.getItem('lifepulse_onboarded'));

  // User Profile
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lifepulse_user');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {}
    return {
      isLoggedIn: true,
      name: 'Vikramaditya Sharma',
      phone: '+91 98200 14829',
      bloodGroup: 'O-',
      city: 'Mumbai',
      role: 'donor',
    };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lifepulse_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const loginUser = (userData) => {
    const userObj = { ...userData, isLoggedIn: true };
    setCurrentUser(userObj);
    localStorage.setItem('lifepulse_user', JSON.stringify(userObj));
    localStorage.setItem('lifepulse_onboarded', 'true');
    if (userData.role) {
      setCurrentRole(userData.role);
      setActiveTab(userData.role === 'donor' ? 'donor_portal' : 'request');
    }
  };

  const logoutUser = () => {
    setCurrentUser({
      isLoggedIn: false,
      name: 'Guest User',
      phone: '',
      bloodGroup: 'N/A',
      city: 'Mumbai',
      role: 'requester',
    });
    localStorage.removeItem('lifepulse_onboarded');
    setShowAuthModal(true);
  };

  const bypassDemoLogin = () => {
    localStorage.setItem('lifepulse_onboarded', 'true');
    setShowAuthModal(false);
  };
  
  // Active role: 'requester' | 'donor' | 'hospital_admin'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('lifepulse_role') || 'requester';
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('lifepulse_tab') || 'request';
  });

  useEffect(() => {
    localStorage.setItem('lifepulse_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('lifepulse_tab', activeTab);
  }, [activeTab]);

  // Low-Network / SMS Fallback Mode Toggle
  const [isLowNetworkMode, setIsLowNetworkMode] = useState(false);

  // Hospitals & Donors & Blood Banks
  const [hospitals] = useState(DEFAULT_HOSPITALS);
  const [bloodBanks, setBloodBanks] = useState(INITIAL_BLOOD_BANKS);
  const [donors, setDonors] = useState(() => {
    try {
      const saved = localStorage.getItem('lifepulse_donors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved donors', e);
    }
    return INITIAL_DONORS;
  });

  // Modals state for new features
  const [quizModal, setQuizModal] = useState({ isOpen: false, requestId: null, donorId: null });
  const [whatsAppModal, setWhatsAppModal] = useState({ isOpen: false, request: null, isSimulatedFulfilled: false });
  const [rideModal, setRideModal] = useState({ isOpen: false, request: null });

  // -------------------------------------------------------------
  // HORIZON 2: Scheduled & Recurring Care States
  // -------------------------------------------------------------
  const [buddyCircles, setBuddyCircles] = useState(() => {
    try {
      const saved = localStorage.getItem('lifepulse_buddy_circles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_BUDDY_CIRCLES;
  });

  const [plannedSurgeries, setPlannedSurgeries] = useState(() => {
    try {
      const saved = localStorage.getItem('lifepulse_planned_surgeries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PLANNED_SURGERIES;
  });

  // -------------------------------------------------------------
  // HORIZON 3: Community Camps & Digital Fast-Track Pass
  // -------------------------------------------------------------
  const [communityCamps, setCommunityCamps] = useState(() => {
    try {
      const saved = localStorage.getItem('lifepulse_community_camps');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_COMMUNITY_CAMPS;
  });

  const [bookedPass, setBookedPass] = useState(() => {
    try {
      const saved = localStorage.getItem('lifepulse_booked_pass');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // -------------------------------------------------------------
  // DONOR RETENTION: Impact Timeline & Health Vault
  // -------------------------------------------------------------
  const [pastDonations, setPastDonations] = useState(INITIAL_PAST_DONATIONS);
  const [donorHealthVault, setDonorHealthVault] = useState(INITIAL_DONOR_HEALTH_VAULT);

  // -------------------------------------------------------------
  // HOSPITAL ADMIN: Near-Expiry Stock Exchange & City Demand Predictor
  // -------------------------------------------------------------
  const [nearExpiryStock, setNearExpiryStock] = useState(() => {
    try {
      const saved = localStorage.getItem('lifepulse_near_expiry_stock');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_NEAR_EXPIRY_STOCK;
  });

  const [cityDemandAlert, setCityDemandAlert] = useState(() => {
    try {
      const saved = localStorage.getItem('lifepulse_city_demand');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return INITIAL_CITY_DEMAND_PREDICTOR;
  });

  // Current logged in donor profile (default to donor-1 Vikramaditya Sharma, O-)
  const [currentDonorId, setCurrentDonorId] = useState(() => {
    return localStorage.getItem('lifepulse_current_donor_id') || 'donor-1';
  });

  // Requests state
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('lifepulse_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved requests', e);
    }
    return [
      {
        id: 'REQ-8821',
        patientName: 'Rohan Deshmukh',
        bloodGroup: 'A-',
        componentType: 'Whole Blood',
        units: 2,
        urgency: 'Critical - Immediate',
        hospitalId: 'hosp-1',
        hospitalName: 'Lilavati Hospital & Research Centre',
        hospitalArea: 'Bandra West, Mumbai',
        hospitalLat: 19.0522,
        hospitalLng: 72.8306,
        requesterPhone: '+91 98201 44102',
        requesterName: 'Aarti Deshmukh (Sister)',
        doctorSlip: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
        slipVerified: true,
        verificationDoctor: 'Dr. A. K. Sen, Senior Hematologist (Reg #MH-44192)',
        status: 'ACCEPTED', // VERIFIED -> NOTIFIED -> ACCEPTED -> EN_ROUTE -> FULFILLED
        acceptedByDonorId: 'donor-1',
        acceptedByDonorName: 'Vikramaditya Sharma',
        acceptedDonorPhone: '+91 98200 14829',
        searchRadiusKm: 5,
        radiusEscalated: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        donorLiveLocation: {
          lat: 19.0585,
          lng: 72.8290,
          speedKmph: 24,
          etaMinutes: 8,
          distanceKm: 2.1,
          isLiveStreaming: false,
          geofenceReached: false,
        },
        quickStatus: 'Left Home',
        chatMessages: [
          { sender: 'requester', text: 'Thank you Vikram! Patient is in OT-3, Lilavati Hospital.', time: '12:02' },
          { sender: 'donor', text: 'I am on my way via Hill Road. Estimated 8 minutes.', time: '12:04' }
        ]
      }
    ];
  });

  const [activeTrackingRequestId, setActiveTrackingRequestId] = useState(() => {
    return localStorage.getItem('lifepulse_active_req_id') || 'REQ-8821';
  });

  // Broadcast channel for multi-tab sync
  const broadcastRef = useRef(null);
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        broadcastRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        broadcastRef.current.onmessage = (event) => {
          if (event.data?.type === 'SYNC_REQUESTS') {
            setRequests(event.data.requests);
          } else if (event.data?.type === 'SYNC_DONORS') {
            setDonors(event.data.donors);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not available', e);
    }
    return () => {
      broadcastRef.current?.close();
    };
  }, []);

  // Synchronize states to localStorage
  useEffect(() => {
    localStorage.setItem('lifepulse_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('lifepulse_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('lifepulse_current_donor_id', currentDonorId);
  }, [currentDonorId]);

  useEffect(() => {
    localStorage.setItem('lifepulse_active_req_id', activeTrackingRequestId);
  }, [activeTrackingRequestId]);

  useEffect(() => {
    localStorage.setItem('lifepulse_buddy_circles', JSON.stringify(buddyCircles));
  }, [buddyCircles]);

  useEffect(() => {
    localStorage.setItem('lifepulse_planned_surgeries', JSON.stringify(plannedSurgeries));
  }, [plannedSurgeries]);

  useEffect(() => {
    localStorage.setItem('lifepulse_community_camps', JSON.stringify(communityCamps));
  }, [communityCamps]);

  useEffect(() => {
    if (bookedPass) {
      localStorage.setItem('lifepulse_booked_pass', JSON.stringify(bookedPass));
    } else {
      localStorage.removeItem('lifepulse_booked_pass');
    }
  }, [bookedPass]);

  useEffect(() => {
    localStorage.setItem('lifepulse_near_expiry_stock', JSON.stringify(nearExpiryStock));
  }, [nearExpiryStock]);

  useEffect(() => {
    localStorage.setItem('lifepulse_city_demand', JSON.stringify(cityDemandAlert));
  }, [cityDemandAlert]);

  const activeDonor = donors.find((d) => d.id === currentDonorId) || donors[0];
  const activeRequest = requests.find((r) => r.id === activeTrackingRequestId) || requests[0];

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('lifepulse_lang', langCode);
    localStorage.setItem('lifepulse_lang_selected', 'true');
    setShowLanguageModal(false);
  };

  const toggleDonorAvailability = (donorId = currentDonorId) => {
    setDonors((prev) => {
      const updated = prev.map((d) => (d.id === donorId ? { ...d, isAvailable: !d.isAvailable } : d));
      try {
        localStorage.setItem('lifepulse_donors', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const togglePrioritySirenAlerts = (donorId = currentDonorId) => {
    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === donorId) {
          const nextVal = !d.isPrioritySirenAlerts;
          if (nextVal) playEmergencyAlertSound();
          return { ...d, isPrioritySirenAlerts: nextVal };
        }
        return d;
      })
    );
  };

  const getDonorCooldownStatus = (donor = activeDonor) => {
    if (!donor.lastDonationDate) {
      return { inCooldown: false, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0 };
    }
    const donationTime = new Date(donor.lastDonationDate).getTime();
    const cooldownPeriodDays = donor.gender === 'female' ? 120 : 90;
    const cooldownPeriodMs = cooldownPeriodDays * 24 * 60 * 60 * 1000;
    const recoveryEndTime = donationTime + cooldownPeriodMs;
    const now = Date.now();
    const remainingMs = recoveryEndTime - now;

    if (remainingMs <= 0) {
      return { inCooldown: false, daysRemaining: 0, hoursRemaining: 0, minutesRemaining: 0 };
    }

    const daysRemaining = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hoursRemaining = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

    return {
      inCooldown: true,
      totalDays: cooldownPeriodDays,
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
      recoveryEndTime: new Date(recoveryEndTime).toLocaleDateString(),
    };
  };

  const createRequest = (requestData) => {
    const selectedHosp = hospitals.find((h) => h.id === requestData.hospitalId) || hospitals[0];
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: requestData.patientName,
      bloodGroup: requestData.bloodGroup,
      componentType: requestData.componentType || 'Whole Blood',
      units: Number(requestData.units) || 1,
      urgency: requestData.urgency || 'Critical - Immediate',
      hospitalId: selectedHosp.id,
      hospitalName: selectedHosp.name,
      hospitalArea: selectedHosp.area,
      hospitalLat: selectedHosp.lat,
      hospitalLng: selectedHosp.lng,
      requesterPhone: requestData.requesterPhone,
      requesterName: requestData.requesterName || 'Attendant',
      doctorSlip: requestData.doctorSlip || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
      slipVerified: true,
      verificationDoctor: 'Dr. Rajesh Deshpande, CMO (Simulated Verified)',
      status: 'NOTIFIED',
      acceptedByDonorId: null,
      acceptedByDonorName: null,
      searchRadiusKm: 2,
      radiusEscalated: false,
      createdAt: new Date().toISOString(),
      donorLiveLocation: null,
      quickStatus: null,
      chatMessages: []
    };

    setRequests((prev) => {
      const updated = [newReq, ...prev];
      try {
        localStorage.setItem('lifepulse_requests', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActiveTrackingRequestId(newReq.id);
    localStorage.setItem('lifepulse_active_req_id', newReq.id);
    setActiveTab('tracker');
    localStorage.setItem('lifepulse_tab', 'tracker');
    playEmergencyAlertSound();

    if (broadcastRef.current) {
      broadcastRef.current.postMessage({ type: 'SYNC_REQUESTS', requests: [newReq, ...requests] });
    }
    return newReq;
  };

  // Intercept acceptRequest with 20-second Pre-Donation Quiz
  const initiateAcceptRequest = (requestId, donorId = currentDonorId) => {
    setQuizModal({ isOpen: true, requestId, donorId });
  };

  // Called when quiz passes
  const handleQuizSuccess = (requestId, donorId = currentDonorId) => {
    setQuizModal({ isOpen: false, requestId: null, donorId: null });
    const donor = donors.find((d) => d.id === donorId) || activeDonor;
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const dist = calculateDistanceKm(donor.lat, donor.lng, req.hospitalLat, req.hospitalLng);
    const estimatedMinutes = Math.max(3, Math.round(dist * 3.5));

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updated = requests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'ACCEPTED',
          acceptedByDonorId: donor.id,
          acceptedByDonorName: donor.name,
          acceptedDonorPhone: donor.phoneFull,
          donorLiveLocation: {
            lat: donor.lat,
            lng: donor.lng,
            speedKmph: 0,
            etaMinutes: estimatedMinutes,
            distanceKm: dist,
            isLiveStreaming: false,
            geofenceReached: false,
          },
          quickStatus: 'Eligibility Passed • Accepted Request',
          chatMessages: [
            ...(r.chatMessages || []),
            {
              sender: 'donor',
              text: `Hello! I have passed medical eligibility and accepted the emergency request for ${r.patientName}. I am heading over now.`,
              time: timeStr,
            }
          ]
        };
      }
      return r;
    });

    setRequests(updated);
    setActiveTrackingRequestId(requestId);
    playSuccessChime();
    if (broadcastRef.current) {
      broadcastRef.current.postMessage({ type: 'SYNC_REQUESTS', requests: updated });
    }
  };

  // Called when quiz fails
  const handleQuizFailure = (requestId) => {
    setQuizModal({ isOpen: false, requestId: null, donorId: null });
    // Alert is automatically routed to next compatible donor
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'NOTIFIED',
            quickStatus: 'Rerouting to next verified compatible donor...',
          };
        }
        return r;
      })
    );
  };

  const startJourney = (requestId) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;
    const donor = donors.find((d) => d.id === (req.acceptedByDonorId || currentDonorId)) || activeDonor;

    const route = generateRoutePoints(donor.lat, donor.lng, req.hospitalLat, req.hospitalLng, 25);
    let stepIndex = 0;

    const updated = requests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'EN_ROUTE',
          donorLiveLocation: {
            ...r.donorLiveLocation,
            isLiveStreaming: true,
            speedKmph: 32,
            stepIndex: 0,
          },
          quickStatus: 'Left Home - On The Way',
        };
      }
      return r;
    });

    setRequests(updated);
    playEmergencyAlertSound();

    const interval = setInterval(() => {
      stepIndex += 1;
      if (stepIndex >= route.length) {
        clearInterval(interval);
        completeRequest(requestId);
        return;
      }

      const [currLat, currLng] = route[stepIndex];
      const remainingDistance = calculateDistanceKm(currLat, currLng, req.hospitalLat, req.hospitalLng);
      const remainingEta = Math.max(1, Math.round(remainingDistance * 3.2));

      if (remainingDistance <= 0.1) {
        clearInterval(interval);
        completeRequest(requestId);
        return;
      }

      setRequests((currentRequests) =>
        currentRequests.map((r) => {
          if (r.id === requestId) {
            return {
              ...r,
              donorLiveLocation: {
                lat: currLat,
                lng: currLng,
                speedKmph: Math.floor(25 + Math.random() * 15),
                etaMinutes: remainingEta,
                distanceKm: remainingDistance,
                isLiveStreaming: true,
                geofenceReached: false,
              },
            };
          }
          return r;
        })
      );
    }, 2500);
  };

  const updateQuickStatus = (requestId, statusText) => {
    const updated = requests.map((r) => {
      if (r.id === requestId) {
        let newStatus = r.status;
        if (statusText.toLowerCase().includes('reached')) {
          newStatus = 'FULFILLED';
        } else if (r.status === 'ACCEPTED') {
          newStatus = 'EN_ROUTE';
        }
        return {
          ...r,
          quickStatus: statusText,
          status: newStatus,
        };
      }
      return r;
    });
    setRequests(updated);
    playSuccessChime();
  };

  const completeRequest = (requestId) => {
    const req = requests.find((r) => r.id === requestId);
    const donorId = req?.acceptedByDonorId || currentDonorId;

    const updatedRequests = requests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'FULFILLED',
          quickStatus: 'Reached Hospital Blood Bank & Donation Complete',
          donorLiveLocation: {
            ...r.donorLiveLocation,
            isLiveStreaming: false,
            geofenceReached: true,
            etaMinutes: 0,
            distanceKm: 0.05,
          },
        };
      }
      return r;
    });

    setRequests(updatedRequests);

    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === donorId) {
          return {
            ...d,
            isAvailable: false,
            lastDonationDate: new Date().toISOString(),
            donationsCount: (d.donationsCount || 0) + 1,
          };
        }
        return d;
      })
    );

    playSuccessChime();
  };

  const sendChatMessage = (requestId, text, customSender = null) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const sender = customSender || (currentRole === 'donor' ? 'donor' : 'requester');

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            chatMessages: [...(r.chatMessages || []), { sender, text, time: timeStr }],
          };
        }
        return r;
      })
    );
  };

  const escalateSosRadius = (requestId) => {
    playEscalationSiren();
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            searchRadiusKm: 25,
            radiusEscalated: true,
          };
        }
        return r;
      })
    );
  };

  const verifyRequisition = (requestId, doctorName = 'Dr. S. K. Joshi (Chief Blood Transfusion Officer)') => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            slipVerified: true,
            verificationDoctor: doctorName,
          };
        }
        return r;
      })
    );
    playSuccessChime();
  };

  const resetCooldown = (donorId = currentDonorId) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === donorId ? { ...d, lastDonationDate: null, isAvailable: true } : d))
    );
  };

  const simulateDonationCompletionForDemo = (donorId = currentDonorId) => {
    setDonors((prev) =>
      prev.map((d) =>
        d.id === donorId
          ? {
              ...d,
              lastDonationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
              isAvailable: false,
            }
          : d
      )
    );
  };

  const triggerDemoScenario = () => {
    const demoReq = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: 'Devika Singhania (Emergency C-Section)',
      bloodGroup: 'O-', // Rare universal
      componentType: 'Whole Blood',
      units: 3,
      urgency: 'Critical - Immediate',
      hospitalId: 'hosp-1',
      hospitalName: 'Lilavati Hospital & Research Centre',
      hospitalArea: 'Bandra West, Mumbai',
      hospitalLat: 19.0522,
      hospitalLng: 72.8306,
      requesterPhone: '+91 98200 99882',
      requesterName: 'Kunal Singhania (Husband)',
      doctorSlip: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
      slipVerified: true,
      verificationDoctor: 'Dr. Maya Fernandez, Head of Obstetrics (Verified #MH-9941)',
      status: 'NOTIFIED',
      acceptedByDonorId: null,
      acceptedByDonorName: null,
      searchRadiusKm: 2,
      radiusEscalated: false,
      createdAt: new Date().toISOString(),
      donorLiveLocation: null,
      quickStatus: 'Alerting 6 Verified O- Donors in 2km',
      chatMessages: []
    };

    setRequests((prev) => [demoReq, ...prev]);
    setActiveTrackingRequestId(demoReq.id);
    setCurrentRole('requester');
    setActiveTab('tracker');
    playEmergencyAlertSound();
  };

  // WhatsApp SOS card modal
  const openWhatsAppModal = (req = activeRequest) => {
    setWhatsAppModal({ isOpen: true, request: req, isSimulatedFulfilled: req?.status === 'FULFILLED' });
  };

  const closeWhatsAppModal = () => {
    setWhatsAppModal({ isOpen: false, request: null, isSimulatedFulfilled: false });
  };

  const toggleWhatsAppSimulatedStatus = () => {
    setWhatsAppModal((prev) => ({ ...prev, isSimulatedFulfilled: !prev.isSimulatedFulfilled }));
  };

  // Ride Sponsoring modal
  const openRideModal = (req = activeRequest) => {
    setRideModal({ isOpen: true, request: req });
  };

  const closeRideModal = () => {
    setRideModal({ isOpen: false, request: null });
  };

  // -------------------------------------------------------------
  // Horizon 2 & 3 Action Handlers
  // -------------------------------------------------------------
  const joinBuddyCircle = (circleId) => {
    const donorName = currentUser?.name || activeDonor?.name || 'Voluntary Donor';
    const bloodGroup = activeDonor?.bloodGroup || currentUser?.bloodGroup || 'O-';
    const cooldownInfo = getDonorCooldownStatus();

    let recommendedSlot = 'Rotation Slot (Immediate)';
    if (cooldownInfo.inCooldown) {
      recommendedSlot = `Rotation Post-Cooldown (${cooldownInfo.recoveryEndTime})`;
    } else {
      recommendedSlot = 'Slot: Next Transfusion Date Confirmed';
    }

    setBuddyCircles((prev) =>
      prev.map((circle) => {
        if (circle.id !== circleId) return circle;
        const alreadyJoined = circle.pledgedDonors.some((d) => d.id === currentDonorId || d.name === donorName);
        if (alreadyJoined) return circle;

        const newPledge = {
          id: currentDonorId || `donor-${Date.now()}`,
          name: donorName,
          bloodGroup: bloodGroup,
          rotationSlot: recommendedSlot,
          joinedAt: new Date().toISOString().split('T')[0],
        };

        const updatedDonors = [...circle.pledgedDonors, newPledge];
        const remaining = circle.targetDonorsCount - updatedDonors.length;
        return {
          ...circle,
          pledgedDonors: updatedDonors,
          urgencyLevel: remaining > 0 ? `${remaining} Slot${remaining > 1 ? 's' : ''} Needed` : 'Circle Fully Supported ✓',
        };
      })
    );
    playSuccessChime();
  };

  const pledgePlannedSurgery = (surgeryId) => {
    const donorName = currentUser?.name || activeDonor?.name || 'Voluntary Donor';
    const bloodGroup = activeDonor?.bloodGroup || currentUser?.bloodGroup || 'O-';

    setPlannedSurgeries((prev) =>
      prev.map((surg) => {
        if (surg.id !== surgeryId) return surg;
        const alreadyPledged = surg.pledgedDonors.some((d) => d.name.includes(donorName));
        if (alreadyPledged) return surg;

        const newPledge = {
          name: `${donorName} (${bloodGroup})`,
          bloodGroup,
          datePledged: new Date().toISOString().split('T')[0],
          status: 'Confirmed Standby',
        };
        const newUnitsPledged = Math.min(surg.unitsRequired, surg.unitsPledged + 1);
        return {
          ...surg,
          pledgedDonors: [...surg.pledgedDonors, newPledge],
          unitsPledged: newUnitsPledged,
          status: newUnitsPledged >= surg.unitsRequired ? 'PLEDGE_FULFILLED' : 'PLEDGE_IN_PROGRESS',
        };
      })
    );
    playSuccessChime();
  };

  const createPlannedSurgery = (newSurgeryData) => {
    const newSurgery = {
      id: `surg-${Math.floor(100 + Math.random() * 900)}`,
      patientName: newSurgeryData.patientName,
      patientAge: Number(newSurgeryData.patientAge) || 45,
      bloodGroup: newSurgeryData.bloodGroup,
      componentType: newSurgeryData.componentType || 'Whole Blood / PRBC',
      surgeryType: newSurgeryData.surgeryType,
      hospitalName: newSurgeryData.hospitalName,
      hospitalArea: newSurgeryData.hospitalArea || 'Mumbai Metro',
      surgeryDate: newSurgeryData.surgeryDate,
      daysUntilSurgery: Math.max(1, Math.round((new Date(newSurgeryData.surgeryDate) - Date.now()) / (24 * 60 * 60 * 1000))),
      unitsRequired: Number(newSurgeryData.unitsRequired) || 2,
      unitsPledged: 0,
      pledgedDonors: [],
      familyContact: newSurgeryData.familyContact || `${currentUser?.name} • ${currentUser?.phone}`,
      doctorSlipVerified: true,
      doctorName: newSurgeryData.doctorName || 'Authorized Hospital Surgeon',
      status: 'PLEDGE_IN_PROGRESS',
      notes: newSurgeryData.notes || 'Pre-scheduled operative replacement requirement.',
    };
    setPlannedSurgeries((prev) => [newSurgery, ...prev]);
    playSuccessChime();
  };

  const bookCampSlot = (campId, timeSlot) => {
    const targetCamp = communityCamps.find((c) => c.id === campId) || communityCamps[0];
    const passData = {
      passId: `PASS-LP-${Math.floor(1000 + Math.random() * 9000)}`,
      donorName: currentUser?.name || activeDonor?.name || 'Vikramaditya Sharma',
      bloodGroup: activeDonor?.bloodGroup || currentUser?.bloodGroup || 'O-',
      campTitle: targetCamp.title,
      venue: targetCamp.venue,
      date: targetCamp.date,
      timeSlot: timeSlot || '10:30 AM',
      organizer: targetCamp.organizer,
      emergencyHospital: targetCamp.emergencyHospitalPartner,
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCommunityCamps((prev) =>
      prev.map((c) =>
        c.id === campId
          ? { ...c, bookedSlots: Math.min(c.totalSlots, c.bookedSlots + 1) }
          : c
      )
    );

    setBookedPass(passData);
    playSuccessChime();
  };

  const hostNewCamp = (campData) => {
    const newCamp = {
      id: `camp-${Date.now()}`,
      title: campData.title,
      organizer: campData.organizer,
      organizerBadge: 'Community Registered Drive',
      organizerLogo: '🩸',
      date: campData.date,
      time: campData.time || '10:00 AM - 04:00 PM',
      venue: campData.venue,
      distanceKm: 3.5,
      totalSlots: Number(campData.totalSlots) || 50,
      bookedSlots: 0,
      inDemandBloodGroups: campData.inDemandBloodGroups || ['All Blood Groups'],
      perks: ['Fast-Track QR Pass Entry', 'Free Hb Screening & Vitals', 'Donor Certificate'],
      emergencyHospitalPartner: campData.emergencyHospitalPartner || 'Lilavati Hospital & Blood Centre',
      contactPerson: campData.contactPerson || `${currentUser?.name} • ${currentUser?.phone}`,
    };
    setCommunityCamps((prev) => [newCamp, ...prev]);
    playSuccessChime();
  };

  const broadcastStockTransfer = (stockId, targetHospital) => {
    setNearExpiryStock((prev) =>
      prev.map((item) =>
        item.id === stockId
          ? {
              ...item,
              transferBroadcastStatus: 'ACCEPTED',
              assignedHospital: targetHospital || item.suggestedTransferHospital,
              transferTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : item
      )
    );
    playSuccessChime();
  };

  const preAlertDonors = () => {
    setCityDemandAlert((prev) => ({
      ...prev,
      preAlertDispatched: true,
      confirmedBookingsCount: prev.confirmedBookingsCount + 6,
    }));
    playEmergencyAlertSound();
  };

  return (
    <AppContext.Provider
      value={{
        currentTheme,
        changeTheme,
        showAuthModal,
        setShowAuthModal,
        currentUser,
        loginUser,
        logoutUser,
        bypassDemoLogin,
        language,
        changeLanguage,
        showLanguageModal,
        setShowLanguageModal,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        isLowNetworkMode,
        setIsLowNetworkMode,
        hospitals,
        bloodBanks,
        setBloodBanks,
        donors,
        setDonors,
        currentDonorId,
        setCurrentDonorId,
        activeDonor,
        requests,
        activeTrackingRequestId,
        setActiveTrackingRequestId,
        activeRequest,
        createRequest,
        initiateAcceptRequest,
        acceptRequest: handleQuizSuccess, // backward compat
        quizModal,
        setQuizModal,
        handleQuizSuccess,
        handleQuizFailure,
        whatsAppModal,
        openWhatsAppModal,
        closeWhatsAppModal,
        toggleWhatsAppSimulatedStatus,
        rideModal,
        openRideModal,
        closeRideModal,
        startJourney,
        updateQuickStatus,
        completeRequest,
        sendChatMessage,
        escalateSosRadius,
        verifyRequisition,
        toggleDonorAvailability,
        togglePrioritySirenAlerts,
        getDonorCooldownStatus,
        resetCooldown,
        simulateDonationCompletionForDemo,
        triggerDemoScenario,
        // Horizon 2 & 3 State & Actions
        buddyCircles,
        setBuddyCircles,
        joinBuddyCircle,
        plannedSurgeries,
        setPlannedSurgeries,
        pledgePlannedSurgery,
        createPlannedSurgery,
        communityCamps,
        setCommunityCamps,
        bookedPass,
        setBookedPass,
        bookCampSlot,
        hostNewCamp,
        pastDonations,
        donorHealthVault,
        nearExpiryStock,
        broadcastStockTransfer,
        cityDemandAlert,
        preAlertDonors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
