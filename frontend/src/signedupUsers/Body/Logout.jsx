import {Alert} from 'flowbite-react';
export default function Logout(){
    localStorage.removeItem("token");
    setTimeout(() => {
    window.location.href="/signin";
    },1000);
    return(
        <div className="fixed top-20 right-4 z-[999]">
          <Alert color="failure">
            <span className="font-medium">Session expired!</span> Redirecting to login...
          </Alert>
        </div>
    )
}