export function analyzeSymptomsText(symptomsText){
  const text = (symptomsText || '').toLowerCase()
  if (text.includes('fever') && text.includes('cough')) return 'Flu-like symptoms, please consult a doctor.'
  if (text.includes('headache')) return 'Hydrate and rest. If persistent, book an appointment.'
  return 'Monitor symptoms. If they worsen, consult a doctor.'
}



