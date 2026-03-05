/**
 * Branding Configuration
 * Centralized location for app name and other branding assets.
 * Reads from environment variables or defaults to "RPM".
 */

const BRANDING = {
    appName: import.meta.env.VITE_APP_NAME || 'RPM',
    companyName: import.meta.env.VITE_COMPANY_NAME || 'Raj Pan Mahal',
    logoAlt: `${import.meta.env.VITE_APP_NAME || 'RPM'} Logo`,
    // Add more branding assets here as needed
};

export default BRANDING;
