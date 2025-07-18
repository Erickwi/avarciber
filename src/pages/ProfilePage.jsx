import { useAuth } from "../context/AuthContext"

function ProfilePage() {

  const { user } = useAuth();
  
  return (
    <div>ProfilePage</div>
  )
}

export default ProfilePage