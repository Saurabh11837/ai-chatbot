import API from "../utils/api";

export const signupUser = async (data) => {

  const res = await fetch(`${API}/auth/signup`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  })

  return res.json()
}


export const verifyOTP = async (data) => {

  const res = await fetch(`${API}/auth/verify-otp`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  })

  return res.json()
}


export const loginUser = async (data) => {

  const res = await fetch(`${API}/auth/login`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  })

  return res.json()
}


export const completeProfile = async (data,token) => {

  const res = await fetch(`${API}/auth/complete-profile`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${token}`
    },
    body:JSON.stringify(data)
  })

  return res.json()
}