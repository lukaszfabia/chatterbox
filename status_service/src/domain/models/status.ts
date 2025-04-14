/**
 * Represents a user's status, including their online/offline state.
 * 
 * This class is used to store and manage a user's status, such as whether the user is online or offline.
 */
export class UserStatus {
    /**
     * Creates an instance of UserStatus.
     * 
     * @param userID - The unique identifier of the user.
     * @param isOnline - A boolean indicating whether the user is currently online (true) or offline (false).
     */
    constructor(
        public readonly userID: string,
        public isOnline: boolean,
    ) { }
}
