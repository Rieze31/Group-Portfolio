// Members loaded from the Spring Boot API (see main.jsx). Shared by every component.
let M = [];
export const members = () => M;
export function loadMembers(list) { M = list; }
