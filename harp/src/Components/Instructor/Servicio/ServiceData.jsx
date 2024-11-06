// Este archivo se encarga de almacenar los datos de cada paso
export const serviceData = {
    serviceName: '',
    category: '',
    description: '',
    logo: null,
    location: '',
    mode: '',
    maxStudents: '',
    maxStudentsPerGroup: '',
    duration: '',
    startDate: '',
    endDate: '',
    paymentFrequency: '',
    amount: '',
    attendanceTracking: '',
    trialOffer: '',
    publicVisibility: ''
};

export const setServiceData = (key, value) => {
    serviceData[key] = value;
};
