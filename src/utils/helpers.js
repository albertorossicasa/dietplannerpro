export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT');
};

export const formatDateTime = (dateString, timeString) => {
  if (!dateString) return '';
  return `${formatDate(dateString)} ${timeString || ''}`;
};

export const formatCurrency = (amount) => `€ ${amount.toFixed(2)}`;
export const formatWeight = (kg) => `${kg.toFixed(1)} kg`;

export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const h = height / 100;
  const bmi = weight / (h * h);
  return bmi.toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Sottopeso';
  if (bmi < 25) return 'Normopeso';
  if (bmi < 30) return 'Sovrappeso';
  return 'Obesità';
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validateCF = (cf) => /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/.test(cf);