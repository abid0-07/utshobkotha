export type ProfileData = {
  name: string;
  email: string;
  bio: string;
  department: string;
  phone: string;
  institution: string;
};

// Simulate an API call to update the profile
export async function updateProfile(profileData: ProfileData): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success or failure
      const isSuccess = true; // Change to `false` to simulate an error
      if (isSuccess) {
        console.log("Profile updated successfully:", profileData);
        resolve();
      } else {
        reject(new Error("Failed to update profile. Please try again."));
      }
    }, 1000); // Simulate a 1-second delay
  });
}
