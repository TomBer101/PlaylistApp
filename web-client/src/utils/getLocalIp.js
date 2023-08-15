const getLocalIPAddress = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = data.ip;
    } catch (error) {
        console.error("Error fetching local IP address: ", error);
        return null;
    }
}

export default getLocalIPAddress;