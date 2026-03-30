import { useContext } from "react";
import ProfileCard from "../ProfileCard/ProfileCard";
import Loader from "../Loader/Loader";
import { authContext } from "../../Context/AuthiContext";

export default function Profile() {
  const { userData } = useContext(authContext);

  if (!userData) {
    return <Loader />;
  }

  return (
    //  <ProfileCard user={userData}/>
    <ProfileCard user={userData} />
  );
}
