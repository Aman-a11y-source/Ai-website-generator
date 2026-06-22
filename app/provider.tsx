"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserDetailContext } from "@/context/userDetailContext";
import { OnSaveContext } from "@/context/OnSaveContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Provider({children}: {children: React.ReactNode}) {
    const { userId } = useAuth();
    const { user } = useUser();
    const [userDetail,setUserDetail]=useState<any>(null);
    const [onSaveData,setOnSaveData]=useState<any>(null);
    useEffect(() => {
        const CreateNewUser = async () => {
            const result = await axios.post("/api/users", {
                userId: userId,
                name: user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User",
                email: user?.primaryEmailAddress?.emailAddress,
            });
            console.log(result.data);
            setUserDetail(result.data?.user);
        };

        if (userId && user) {
            CreateNewUser();
        }
    }, [userId, user]);
    
    return (
        <ThemeProvider>
            <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
                <OnSaveContext.Provider value={{onSaveData,setOnSaveData}}>
                    {children}
                </OnSaveContext.Provider>
            </UserDetailContext.Provider>
        </ThemeProvider>
    );
}
