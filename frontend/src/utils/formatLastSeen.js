export const formatLastSeen = (lastSeenDate) => {
    if (!lastSeenDate) return "Never";

    const now = new Date();
    const lastSeen = new Date(lastSeenDate);
    const diffInSeconds = Math.floor((now - lastSeen) / 1000);

    if (diffInSeconds < 60) {
        return "Active now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks}w ago`;
    }

    // For older dates, show the actual date
    return lastSeen.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: lastSeen.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
};
