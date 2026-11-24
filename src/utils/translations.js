// Multilingual Dictionary: English, Hindi (हिंदी), Marathi (मराठी), Gujarati (ગુજરાતી)

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
];

export const TRANSLATIONS = {
  en: {
    appName: 'LifePulse Network',
    tagline: 'Rapid Voluntary Blood Donor Network',
    medicalDisclaimer: 'This platform is a community coordination prototype and must not be treated as an emergency medical service.',
    disclaimerBanner: 'Medical Notice: LifePulse facilitates voluntary donor coordination only. In life-threatening emergencies, always dial 108/102 and contact your nearest hospital blood bank directly.',
    
    // Roles
    roleRequester: 'Patient Family View',
    roleDonor: 'Voluntary Donor View',
    roleAdmin: 'Hospital Admin Verifier',
    roleSelectorTitle: 'Demo Role Switcher',
    
    // Navigation
    navEmergencyRequest: 'Urgent Request',
    navDonorFeed: 'Donor Dashboard',
    navHospitalVerification: 'Admin Verification',
    navCompatibility: 'Compatibility Visualizer',
    navLiveTracking: 'Live Tracker',
    navScheduledCare: 'Scheduled Care',
    demoScenarioBtn: '⚡ Quick Demo Scenario',
    
    // Request Form
    requestTitle: 'Post Urgent Blood Need',
    requestSubtitle: 'Hyperlocal broadcast reaches verified donors within 2 km radius in real-time.',
    patientName: 'Patient Full Name',
    bloodGroupRequired: 'Required Blood Group',
    componentType: 'Component Type',
    unitsRequired: 'Units Required (Pints / Bags)',
    urgencyLevel: 'Urgency Level',
    urgencyCritical: 'Critical - Immediate (Surgery/Trauma)',
    urgency6Hours: 'Within 6 Hours (Urgent Transfusion)',
    urgencyScheduled: 'Scheduled (Within 24 Hours)',
    hospitalName: 'Hospital / Blood Bank Name',
    hospitalLocation: 'Pinpoint Location on Map',
    requesterPhone: 'Family Contact Mobile Number',
    doctorPrescription: "Upload Doctor's Requisition Slip / Hospital Memo",
    uploadPlaceholder: 'Upload or snap requisition slip (PNG, JPG, PDF)',
    verifiedSlipBadge: 'Hospital / Admin Verified Badge will be issued',
    voiceDictateBtn: 'Dictate Request with Voice',
    listeningVoice: 'Listening... Please speak (e.g., "Patient Rahul needs 2 units of B+ at KEM Hospital")',
    submitRequestBtn: 'Broadcast Urgent SOS to Donors',
    broadcasting: 'Broadcasting to compatible donors...',
    
    // Blood Compatibility
    compatTitle: 'Smart Blood Group Compatibility Engine',
    compatSubtitle: 'Who can help whom? Understand exact biological compatibility before requesting.',
    selectedBloodGroup: 'Selected Blood Group',
    canReceiveFrom: 'Can Receive From (Compatible Donors)',
    canDonateTo: 'Can Donate To (Compatible Recipients)',
    universalDonorTag: 'Universal RBC Donor',
    universalRecipientTag: 'Universal RBC Recipient',
    rareBombayNote: 'Bombay Blood (hh): Can only receive from Bombay Blood donors due to anti-H antibodies.',
    
    // Donor Profile & Dashboard
    donorTitle: 'Voluntary Donor Portal',
    availableStatus: 'Available to Donate',
    unavailableStatus: 'Unavailable / Off Duty',
    recoveryCooldownActive: 'Recovery Cooldown Active',
    recoveryCooldownText: 'You recently saved a life! Your body is currently replenishing hemoglobin.',
    timeRemainingCooldown: 'Time Remaining Before Next Safe Donation:',
    daysMaleFemaleNote: '(Medical safety lock: 90 days for males / 120 days for females to prevent fatigue and anemia)',
    privacyMaskingNotice: '🔒 Privacy Shield: Your mobile number and precise residence are masked until you explicitly accept a request.',
    donorAcceptedSuccess: 'Thank you! You have accepted the request. Contact channels are now unlocked.',
    startJourneyBtn: 'Start Journey to Hospital',
    journeyActiveText: 'Live GPS Journey Streaming Active',
    geofenceRuleNotice: 'Geofencing Rule: Live GPS tracking automatically terminates when you enter within 100 meters of the hospital.',
    
    // Swiggy-Style Status Tracker
    trackingTitle: 'Emergency Blood Request Live Tracker',
    step1: 'Request Verified',
    step2: 'Nearby Donors Notified',
    step3: 'Donor Accepted',
    step4: 'Donor En Route',
    step5: 'Reached Hospital / Fulfilled',
    liveEta: 'Estimated Time of Arrival',
    distanceAway: 'Distance to Hospital',
    manualStatusFallback: 'Low Network? Quick Status Update:',
    statusLeftHome: 'Left Home',
    status5MinsAway: '5 Mins Away',
    statusReachedHospital: 'Reached Blood Bank / Hospital',
    sosEscalationBtn: '🚨 Escalate Radius to 25 km & Alert Regional Blood Banks',
    sosEscalatedNotice: 'Radius expanded to 25 km. 18 regional blood banks & 42 additional donors alerted.',
    
    // Impact Card / Certificate
    verifiedCertificate: 'Verified Blood Donor Certificate',
    livesImpactedBadge: 'Lives Impacted',
    downloadCert: 'Download / Share Certificate',
    certificateId: 'Certificate ID',
    issuedBy: 'Issued by National Voluntary Coordination Registry',

    // Language modal
    chooseLanguageTitle: 'Choose Your Preferred Language',
    chooseLanguageSubtitle: 'आपकी भाषा • तुमची भाषा • તમારી ભાષા',
    continueBtn: 'Continue to LifePulse',
  },
  hi: {
    appName: 'लाइफपल्स नेटवर्क',
    tagline: 'त्वरित स्वैच्छिक रक्तदाता नेटवर्क',
    medicalDisclaimer: 'यह प्लेटफ़ॉर्म एक सामुदायिक समन्वय प्रोटोटाइप है और इसे आपातकालीन चिकित्सा सेवा नहीं माना जाना चाहिए।',
    disclaimerBanner: 'चिकित्सा सूचना: लाइफपल्स केवल स्वैच्छिक रक्तदाता समन्वय की सुविधा प्रदान करता है। आपात स्थिति में तुरंत 108/102 पर कॉल करें।',
    
    // Roles
    roleRequester: 'मरीज़ / परिवार दृश्य',
    roleDonor: 'स्वैच्छिक रक्तदाता दृश्य',
    roleAdmin: 'अस्पताल व्यवस्थापक सत्यापन',
    roleSelectorTitle: 'डेमो रोल बदलें',
    
    // Navigation
    navEmergencyRequest: 'तत्काल रक्त मांग',
    navDonorFeed: 'दाता डैशबोर्ड',
    navHospitalVerification: 'प्रशासक सत्यापन',
    navCompatibility: 'रक्त संगतता चार्ट',
    navLiveTracking: 'लाइव ट्रैकर',
    navScheduledCare: 'नियोजित रक्त सेवा',
    demoScenarioBtn: '⚡ त्वरित डेमो परिदृश्य',
    
    // Request Form
    requestTitle: 'आपातकालीन रक्त अनुरोध दर्ज करें',
    requestSubtitle: '2 किमी के दायरे में सत्यापित दाताओं को वास्तविक समय में अलर्ट भेजा जाता है।',
    patientName: 'मरीज़ का पूरा नाम',
    bloodGroupRequired: 'आवश्यक रक्त समूह (Blood Group)',
    componentType: 'घटक का प्रकार',
    unitsRequired: 'आवश्यक यूनिट्स (Units)',
    urgencyLevel: 'आपात स्थिति का स्तर',
    urgencyCritical: 'अत्यंत गंभीर - तुरंत (Critical)',
    urgency6Hours: '6 घंटे के भीतर (Within 6 Hours)',
    urgencyScheduled: 'नियोजित (Scheduled)',
    hospitalName: 'अस्पताल / ब्लड बैंक का नाम',
    hospitalLocation: 'मानचित्र पर स्थान चुनें',
    requesterPhone: 'परिवार का मोबाइल नंबर',
    doctorPrescription: 'डॉक्टर का पर्चा / मांग पर्ची अपलोड करें',
    uploadPlaceholder: 'पर्चा या अस्पताल पर्ची की तस्वीर अपलोड करें',
    verifiedSlipBadge: 'अस्पताल सत्यापन बैज जारी किया जाएगा',
    voiceDictateBtn: 'बोलकर जानकारी भरें (Voice Input)',
    listeningVoice: 'सुन रहे हैं... बोलिए (उदा. "मरीज़ राहुल को केईएम अस्पताल में 2 यूनिट बी पॉजिटिव रक्त चाहिए")',
    submitRequestBtn: 'रक्तदाताओं को तत्काल SOS संदेश भेजें',
    broadcasting: 'संगत दाताओं को प्रसारित किया जा रहा है...',
    
    // Blood Compatibility
    compatTitle: 'स्मार्ट रक्त समूह संगतता इंजन',
    compatSubtitle: 'कौन किसे रक्त दे सकता है? अनुरोध करने से पहले वैज्ञानिक संगतता समझें।',
    selectedBloodGroup: 'चुना हुआ रक्त समूह',
    canReceiveFrom: 'इनसे रक्त प्राप्त कर सकते हैं',
    canDonateTo: 'इन्हें रक्त दान कर सकते हैं',
    universalDonorTag: 'सार्वभौमिक दाता (Universal Donor)',
    universalRecipientTag: 'सर्वग्राही (Universal Recipient)',
    rareBombayNote: 'बॉम्बे ब्लड ग्रुप (hh): केवल बॉम्बे ब्लड वाले दाताओं से ही रक्त ले सकते हैं।',
    
    // Donor Profile & Dashboard
    donorTitle: 'स्वैच्छिक दाता पोर्टल',
    availableStatus: 'रक्तदान हेतु उपलब्ध',
    unavailableStatus: 'वर्तमान में अनुपलब्ध',
    recoveryCooldownActive: 'रिकवरी कूलडाउन सक्रिय (विश्राम अवधि)',
    recoveryCooldownText: 'आपने हाल ही में किसी की जान बचाई है! आपका शरीर हीमोग्लोबिन की पुनः पूर्ति कर रहा है।',
    timeRemainingCooldown: 'अगले सुरक्षित रक्तदान हेतु शेष समय:',
    daysMaleFemaleNote: '(चिकित्सा सुरक्षा नियम: पुरुषों के लिए 90 दिन / महिलाओं के लिए 120 दिन)',
    privacyMaskingNotice: '🔒 गोपनीयता सुरक्षा: जब तक आप अनुरोध स्वीकार नहीं करते, आपका नंबर और घर का पता सुरक्षित रहेगा।',
    donorAcceptedSuccess: 'धन्यवाद! आपने अनुरोध स्वीकार कर लिया है। संपर्क विवरण खुल गए हैं।',
    startJourneyBtn: 'अस्पताल के लिए यात्रा शुरू करें',
    journeyActiveText: 'लाइव जीपीएस लोकेशन शेयर हो रही है',
    geofenceRuleNotice: 'जियोफेंसिंग नियम: अस्पताल के 100 मीटर के दायरे में आते ही जीपीएस ट्रैकिंग अपने आप बंद हो जाती है।',
    
    // Swiggy-Style Status Tracker
    trackingTitle: 'आपातकालीन रक्त अनुरोध लाइव ट्रैकर',
    step1: 'अनुरोध सत्यापित',
    step2: 'दाताओं को अलर्ट भेजा',
    step3: 'दाता ने स्वीकार किया',
    step4: 'दाता रास्ते में है',
    step5: 'अस्पताल पहुंचे / पूर्ण',
    liveEta: 'अनुमानित आगमन समय (ETA)',
    distanceAway: 'अस्पताल से दूरी',
    manualStatusFallback: 'नेटवर्क धीमा है? त्वरित स्थिति अपडेट:',
    statusLeftHome: 'घर से निकले',
    status5MinsAway: '5 मिनट दूर',
    statusReachedHospital: 'अस्पताल / ब्लड बैंक पहुंच गए',
    sosEscalationBtn: '🚨 खोज दायरा 25 किमी तक बढ़ाएं और क्षेत्रीय ब्लड बैंकों को अलर्ट करें',
    sosEscalatedNotice: 'दायरा 25 किमी तक बढ़ाया गया। 18 क्षेत्रीय ब्लड बैंक और 42 अतिरिक्त दाताओं को सतर्क किया गया।',
    
    // Impact Card / Certificate
    verifiedCertificate: 'सत्यापित रक्तदान प्रमाणपत्र',
    livesImpactedBadge: 'प्रभावित जीवन',
    downloadCert: 'प्रमाणपत्र डाउनलोड / साझा करें',
    certificateId: 'प्रमाणपत्र संख्या',
    issuedBy: 'राष्ट्रीय स्वैच्छिक समन्वय रजिस्ट्री द्वारा जारी',

    // Language modal
    chooseLanguageTitle: 'अपनी पसंदीदा भाषा चुनें',
    chooseLanguageSubtitle: 'Choose Your Preferred Language',
    continueBtn: 'लाइफपल्स जारी रखें',
  },
  mr: {
    appName: 'लाइफपल्स नेटवर्क',
    tagline: 'जलद ऐच्छिक रक्तदाता नेटवर्क',
    medicalDisclaimer: 'हे व्यासपीठ एक सामाजिक समन्वय प्रोटोटाइप आहे आणि याला आपत्कालीन वैद्यकीय सेवा मानले जाऊ नये.',
    disclaimerBanner: 'वैद्यकीय सूचना: लाइफपल्स केवळ ऐच्छिक रक्तदाता समन्वयाची सुविधा देते. आणीबाणीच्या वेळी ताबडतोब 108/102 वर संपर्क साधा.',
    
    // Roles
    roleRequester: 'रुग्ण / नातेवाईक दृश्य',
    roleDonor: 'ऐच्छिक रक्तदाता दृश्य',
    roleAdmin: 'रुग्णालय प्रशासक पडताळणी',
    roleSelectorTitle: 'डेमो रोल बदला',
    
    // Navigation
    navEmergencyRequest: 'तातडीची रक्त मागणी',
    navDonorFeed: 'रक्तदाता डॅशबोर्ड',
    navHospitalVerification: 'प्रशासक पडताळणी',
    navCompatibility: 'रक्त सुसंगतता चार्ट',
    navLiveTracking: 'थेट ट्रॅकर',
    navScheduledCare: 'नियोजित काळजी',
    demoScenarioBtn: '⚡ जलद डेमो परिस्थिती',
    
    // Request Form
    requestTitle: 'तातडीची रक्त मागणी नोंदवा',
    requestSubtitle: '२ किमी परिसरातील पडताळणी केलेल्या रक्तदात्यांना त्वरित अलर्ट जातो.',
    patientName: 'रुग्णाचे पूर्ण नाव',
    bloodGroupRequired: 'आवश्यक रक्तगट (Blood Group)',
    componentType: 'घटकाचा प्रकार',
    unitsRequired: 'आवश्यक युनिट्स',
    urgencyLevel: 'तातडीचा स्तर',
    urgencyCritical: 'अति तातडीचे - लगेच (Critical)',
    urgency6Hours: '६ तासांच्या आत (Within 6 Hours)',
    urgencyScheduled: 'नियोजित (Scheduled)',
    hospitalName: 'रुग्णालय / रक्तपेढीचे नाव',
    hospitalLocation: 'नकाशावर स्थान निवडा',
    requesterPhone: 'नातेवाईकांचा मोबाइल क्रमांक',
    doctorPrescription: 'डॉक्टरांची चिठ्ठी / मागणी पत्र अपलोड करा',
    uploadPlaceholder: 'डॉक्टरांच्या चिठ्ठीचे छायाचित्र जोडा',
    verifiedSlipBadge: 'रुग्णालय पडताळणी बॅज जारी केला जाईल',
    voiceDictateBtn: 'आवाजाने माहिती भरा (Voice Input)',
    listeningVoice: 'ऐकत आहे... बोला (उदा. "रुग्ण राहुलसाठी केईएम रुग्णालयात २ युनिट बी पॉझिटिव्ह रक्त हवे")',
    submitRequestBtn: 'रक्तदात्यांना तातडीचा SOS संदेश पाठवा',
    broadcasting: 'सुसंगत रक्तदात्यांपर्यंत संदेश पोहोचवत आहे...',
    
    // Blood Compatibility
    compatTitle: 'स्मार्ट रक्तगट सुसंगतता इंजिन',
    compatSubtitle: 'कोण कोणाला मदत करू शकते? वैज्ञानिक सुसंगतता तपासा.',
    selectedBloodGroup: 'निवडलेला रक्तगट',
    canReceiveFrom: 'यांच्याकडून रक्त स्वीकारू शकता',
    canDonateTo: 'यांना रक्त देऊ शकता',
    universalDonorTag: 'सर्वयोग्य दाता (Universal Donor)',
    universalRecipientTag: 'सर्वयोग्य ग्राहक (Universal Recipient)',
    rareBombayNote: 'बॉम्बे ब्लड ग्रुप (hh): केवळ बॉम्बे ब्लड दात्यांकडूनच रक्त स्वीकारू शकतात.',
    
    // Donor Profile & Dashboard
    donorTitle: 'ऐच्छिक रक्तदाता पोर्टल',
    availableStatus: 'रक्तदानासाठी उपलब्ध',
    unavailableStatus: 'सध्या अनुपलब्ध',
    recoveryCooldownActive: 'विश्रांती कालावधी सुरू आहे (Recovery Cooldown)',
    recoveryCooldownText: 'तुम्ही नुकताच एकाचा जीव वाचवला आहे! तुमचे शरीर सध्या हिमोग्लोबिन भरून काढत आहे.',
    timeRemainingCooldown: 'पुढील सुरक्षित रक्तदानासाठी उर्वरित वेळ:',
    daysMaleFemaleNote: '(वैद्यकीय सुरक्षितता: पुरुषांसाठी ९० दिवस / महिलांसाठी १२० दिवस विश्रांती)',
    privacyMaskingNotice: '🔒 गोपनीयता रक्षण: जोपर्यंत तुम्ही मागणी स्वीकारत नाही तोपर्यंत तुमचा नंबर व पत्ता सुरक्षित राहील.',
    donorAcceptedSuccess: 'धन्यवाद! तुम्ही मागणी स्वीकारली आहे. संपर्क खुला झाला आहे.',
    startJourneyBtn: 'रुग्णालयाकडे प्रवास सुरू करा',
    journeyActiveText: 'थेट जीपीएस ट्रॅकिंग सुरू आहे',
    geofenceRuleNotice: 'जिओफेन्सिंग नियम: रुग्णालयाच्या १०० मीटर परिसरात पोहोचताच जीपीएस ट्रॅकिंग आपोआप थांबते.',
    
    // Swiggy-Style Status Tracker
    trackingTitle: 'आणीबाणी रक्त मागणी थेट ट्रॅकर',
    step1: 'मागणी पडताळली',
    step2: 'दात्यांना सूचना दिली',
    step3: 'दात्याने स्वीकारले',
    step4: 'दाता निघत आहे',
    step5: 'रुग्णालयात पोहोचले / पूर्ण',
    liveEta: 'अंदाजे पोहोचण्याची वेळ (ETA)',
    distanceAway: 'रुग्णालयापासून अंतर',
    manualStatusFallback: 'नेटवर्क कमी आहे? त्वरित अपडेट:',
    statusLeftHome: 'घरातून निघालो',
    status5MinsAway: '५ मिनिटांत पोहोचतो',
    statusReachedHospital: 'रुग्णालयात / रक्तपेढीत पोहोचलो',
    sosEscalationBtn: '🚨 शोध कक्ष २५ किमी पर्यंत वाढवा आणि प्रादेशिक रक्तपेढ्यांना अलर्ट करा',
    sosEscalatedNotice: 'कक्ष २५ किमी पर्यंत वाढवला. १८ प्रादेशिक रक्तपेढ्या आणि ४२ अतिरिक्त दात्यांना सतर्क केले.',
    
    // Impact Card / Certificate
    verifiedCertificate: 'प्रमाणित रक्तदान प्रमाणपत्र',
    livesImpactedBadge: 'वाचवलेले प्राण',
    downloadCert: 'प्रमाणपत्र डाउनलोड / शेअर करा',
    certificateId: 'प्रमाणपत्र क्रमांक',
    issuedBy: 'राष्ट्रीय ऐच्छिक समन्वय नोंदणीद्वारे प्रमाणित',

    // Language modal
    chooseLanguageTitle: 'आपली भाषा निवडा',
    chooseLanguageSubtitle: 'Choose Your Preferred Language',
    continueBtn: 'लाइफपल्स सुरू करा',
  },
  gu: {
    appName: 'લાઇફપલ્સ નેટવર્ક',
    tagline: 'ત્વરિત સ્વૈચ્છિક રક્તદાતા નેટવર્ક',
    medicalDisclaimer: 'આ પ્લેટફોર્મ સમુદાય સંકલન પ્રોટોટાઇપ છે અને તેને કટોકટી તબીબી સેવા ગણવી જોઈએ નહીં.',
    disclaimerBanner: 'તબીબી સૂચના: લાઇફપલ્સ માત્ર સ્વૈચ્છિક રક્તદાતા સંકલનની સુવિધા આપે છે. કટોકટીમાં તરત જ 108/102 નો સંપર્ક કરો.',
    
    // Roles
    roleRequester: 'દર્દી / પરિવાર દૃશ્ય',
    roleDonor: 'સ્વૈચ્છિક રક્તદાતા દૃશ્ય',
    roleAdmin: 'હોસ્પિટલ એડમિન ચકાસણી',
    roleSelectorTitle: 'ડેમો ભૂમિકા બદલો',
    
    // Navigation
    navEmergencyRequest: 'તાત્કાલિક રક્ત વિનંતી',
    navDonorFeed: 'દાતા ડેશબોર્ડ',
    navHospitalVerification: 'એડમિન ચકાસણી',
    navCompatibility: 'રક્ત સુસંગતતા ચાર્ટ',
    navLiveTracking: 'લાઈવ ટ્રેકર',
    navScheduledCare: 'શેડ્યૂલ કરેલ સંભાળ',
    demoScenarioBtn: '⚡ ઝડપી ડેમો પરિસ્થિતિ',
    
    // Request Form
    requestTitle: 'કટોકટી રક્ત જરૂરિયાત નોંધાવો',
    requestSubtitle: '૨ કિમી ત્રિજ્યામાં ચકાસાયેલ દાતાઓને રીઅલ-ટાઇમમાં ચેતવણી મોકલવામાં આવે છે.',
    patientName: 'દર્દીનું પૂરું નામ',
    bloodGroupRequired: 'જરૂરી બ્લડ ગ્રુપ (Blood Group)',
    componentType: 'ઘટક પ્રકાર',
    unitsRequired: 'જરૂરી યુનિટ્સ',
    urgencyLevel: 'કટોકટીનું સ્તર',
    urgencyCritical: 'અત્યંત ગંભીર - તુરંત (Critical)',
    urgency6Hours: '૬ કલાકની અંદર (Within 6 Hours)',
    urgencyScheduled: 'આયોજિત (Scheduled)',
    hospitalName: 'હોસ્પિટલ / બ્લડ બેંકનું નામ',
    hospitalLocation: 'નકશા પર સ્થાન પસંદ કરો',
    requesterPhone: 'પરિવારનો મોબાઇલ નંબર',
    doctorPrescription: 'ડૉક્ટરની ચિઠ્ઠી / માંગણી પત્ર અપલોડ કરો',
    uploadPlaceholder: 'ડૉક્ટરની પ્રિસ્ક્રિપ્શનની છબી જોડો',
    verifiedSlipBadge: 'હોસ્પિટલ ચકાસણી બેજ જારી કરવામાં આવશે',
    voiceDictateBtn: 'બોલીને વિગતો ભરો (Voice Input)',
    listeningVoice: 'સાંભળી રહ્યા છીએ... બોલો (દા.ત. "દર્દી રાહુલ માટે કેઈએમ હોસ્પિટલમાં ૨ યુનિટ બી પોઝિટિવ રક્ત જોઈએ છે")',
    submitRequestBtn: 'રક્તદાતાઓને તાત્કાલિક SOS સંદેશ મોકલો',
    broadcasting: 'સુસંગત દાતાઓ સુધી સંદેશ પ્રસારિત થઈ રહ્યો છે...',
    
    // Blood Compatibility
    compatTitle: 'સ્માર્ટ બ્લડ ગ્રુપ સુસંગતતા એન્જિન',
    compatSubtitle: 'કોણ કોને મદદ કરી શકે છે? વિનંતી કરતા પહેલા વૈજ્ઞાનિક સુસંગતતા સમજો.',
    selectedBloodGroup: 'પસંદ કરેલ બ્લડ ગ્રુપ',
    canReceiveFrom: 'આ લોકો પાસેથી રક્ત મેળવી શકે છે',
    canDonateTo: 'આ લોકોને રક્ત આપી શકે છે',
    universalDonorTag: 'સર્વદાતા (Universal Donor)',
    universalRecipientTag: 'સર્વગ્રાહી (Universal Recipient)',
    rareBombayNote: 'બોમ્બે બ્લડ ગ્રુપ (hh): ફક્ત બોમ્બે બ્લડ દાતાઓ પાસેથી જ રક્ત મેળવી શકાય છે.',
    
    // Donor Profile & Dashboard
    donorTitle: 'સ્વૈચ્છિક દાતા પોર્ટલ',
    availableStatus: 'રક્તદાન માટે ઉપલબ્ધ',
    unavailableStatus: 'હાલમાં અનુપલબ્ધ',
    recoveryCooldownActive: 'રિકવરી કૂલડાઉન સક્રિય (આરામનો સમયગાળો)',
    recoveryCooldownText: 'તમે તાજેતરમાં જ કોઈનો જીવ બચાવ્યો છે! તમારું શરીર હિમોગ્લોબિન પુનઃપ્રાપ્ત કરી રહ્યું છે.',
    timeRemainingCooldown: 'આગામી સુરક્ષિત રક્તદાન માટે બાકી સમય:',
    daysMaleFemaleNote: '(તબીબી સુરક્ષા નિયમ: પુરુષો માટે ૯૦ દિવસ / સ્ત્રીઓ માટે ૧૨૦ દિવસ)',
    privacyMaskingNotice: '🔒 ગોપનીયતા સુરક્ષા: જ્યાં સુધી તમે વિનંતી સ્વીકારો નહીં ત્યાં સુધી તમારો ફોન નંબર અને સરનામું છુપાયેલું રહેશે.',
    donorAcceptedSuccess: 'આભાર! તમે વિનંતી સ્વીકારી છે. સંપર્ક વિગતો અનલૉક થઈ ગઈ છે.',
    startJourneyBtn: 'હોસ્પિટલ તરફ મુસાફરી શરૂ કરો',
    journeyActiveText: 'લાઈવ જીપીએસ ટ્રેકિંગ સક્રિય છે',
    geofenceRuleNotice: 'જિયોફેન્સિંગ નિયમ: હોસ્પિટલના ૧૦૦ મીટરના ત્રિજ્યામાં આવતાં જ જીપીએસ ટ્રેકિંગ આપમેળે બંધ થઈ જાય છે.',
    
    // Swiggy-Style Status Tracker
    trackingTitle: 'કટોકટી રક્ત વિનંતી લાઈવ ટ્રેકર',
    step1: 'વિનંતી ચકાસાયેલ',
    step2: 'દાતાઓને સૂચના મોકલી',
    step3: 'દાતાએ સ્વીકારી',
    step4: 'દાતા રસ્તામાં છે',
    step5: 'હોસ્પિટલ પહોંચ્યા / પૂર્ણ',
    liveEta: 'અંદાજિત આગમન સમય (ETA)',
    distanceAway: 'હોસ્પિટલથી અંતર',
    manualStatusFallback: 'ઓછું નેટવર્ક? ઝડપી સ્થિતિ અપડેટ:',
    statusLeftHome: 'ઘરેથી નીકળ્યા',
    status5MinsAway: '૫ મિનિટ દૂર',
    statusReachedHospital: 'હોસ્પિટલ / બ્લડ બેંક પહોંચ્યા',
    sosEscalationBtn: '🚨 ત્રિજ્યા ૨૫ કિમી સુધી વધારો અને પ્રાદેશિક બ્લડ બેંકોને સચેત કરો',
    sosEscalatedNotice: 'ત્રિજ્યા ૨૫ કિમી સુધી લંબાવી. ૧૮ પ્રાદેશિક બ્લડ બેંકો અને ૪૨ વધારાના દાતાઓને ચેતવણી આપી.',
    
    // Impact Card / Certificate
    verifiedCertificate: 'પ્રમાણિત રક્તદાન પ્રમાણપત્ર',
    livesImpactedBadge: 'બચાવેલ જીવો',
    downloadCert: 'પ્રમાણપત્ર ડાઉનલોડ / શેર કરો',
    certificateId: 'પ્રમાણપત્ર નંબર',
    issuedBy: 'રાષ્ટ્રીય સ્વૈચ્છિક સંકલન રજિસ્ટ્રી દ્વારા જારી',

    // Language modal
    chooseLanguageTitle: 'તમારી પસંદગીની ભાષા પસંદ કરો',
    chooseLanguageSubtitle: 'Choose Your Preferred Language',
    continueBtn: 'લાઇફપલ્સ ચાલુ રાખો',
  }
};

export function getTranslation(lang, key) {
  const currentLang = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return currentLang[key] || TRANSLATIONS.en[key] || key;
}
