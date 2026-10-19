export const formatTo12Hour = (value: string | Date) => {
    let hours: number;
    let minutes: number;

    if (value instanceof Date) {
        hours = value.getHours();
        minutes = value.getMinutes();
    } else {
        // Supports "14:30"
        const [h, m] = value.split(":").map(Number);
        hours = h;
        minutes = m;
    }

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-BD", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};