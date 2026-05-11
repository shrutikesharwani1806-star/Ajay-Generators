import toast from 'react-hot-toast';

export const handleCall = (phoneNumber) => {
  // Copy to clipboard
  navigator.clipboard.writeText(phoneNumber).then(() => {
    toast.success('Phone number copied to clipboard');
  }).catch((err) => {
    console.error('Failed to copy: ', err);
  });

  // Direct to dialer
  window.location.href = `tel:${phoneNumber.replace(/\s+/g, '')}`;
};
