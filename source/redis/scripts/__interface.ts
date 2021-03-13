export interface TokenStorage {
    user: string
    token: string
    refresh_token: string
    expire_sec: string
    expire_in: string
}
export interface TicketStorage {
    user: string
    ticket: string
}