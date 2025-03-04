'use client'
import { Button, Container, Paper, TextField } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup';
import React from 'react'

export default function Page() {
     const router = useRouter()
     
     
     const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email format")
      .required("Email is required")
      .test(
        "unique-email",
        "Email already exists",
        async (value) => {
          if (!value) return false;
          try {
            const response = await axios.get(
              `https://674cacb754e1fca9290d4668.mockapi.io/servers?email=${value}`,
              { headers: { "Content-Type": "application/json" } }
            );
            // If no user is found, email is unique
            return response.data.length === 0;
          } catch (error) {
            console.log("Error checking email uniqueness:", error);
            // In case of error, assume email is unique to avoid blocking registration
            return true;
          }
        }
      ),
          
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least one uppercase, one lowercase, one digit, and one special character"
          )
          .required("Password is required"),
          
        token: Yup.string()
          .matches(
            /^[A-Za-z0-9_-]+$/,
            "Token must be alphanumeric and can include underscores or hyphens"
          )
          .required("Token is required")
      });
  const signinFormikObj=   useFormik({
    initialValues:{
       email:'',
       password:'',
       token:''
        
    },validationSchema,
    onSubmit: async function(values){
        try {
            const { data } = await axios.post(
              'https://674cacb754e1fca9290d4668.mockapi.io/servers',
              values,
              { headers: { 'Content-Type': 'application/json' } }
            );
            console.log("Signup successful:", data);
            router.push('/login');
          } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              console.error("Error signing up:", error.response?.data || error.message);
            } else {
              console.error("Unexpected error:", error);
            }
          }
        
        
    }
  }) 
  return (
    <Container maxWidth='sm' >
     <Paper elevation={20} sx={{ padding:5 , mt:3}}>
       <form onSubmit={signinFormikObj.handleSubmit} action="" style={{display:'flex' , flexDirection:'column' , gap:'20px' ,}}>
       <TextField  onBlur={signinFormikObj.handleBlur}
            error={Boolean(signinFormikObj.touched.email && signinFormikObj.errors.email)}
            helperText={signinFormikObj.touched.email && signinFormikObj.errors.email} id="email" onChange={signinFormikObj.handleChange} value={signinFormikObj.values.email} label="Email" variant="outlined" />
     <TextField  onBlur={signinFormikObj.handleBlur}
            error={Boolean(signinFormikObj.touched.password && signinFormikObj.errors.password)}
            helperText={signinFormikObj.touched.password && signinFormikObj.errors.password}
         id="password" onChange={signinFormikObj.handleChange} value={signinFormikObj.values.password} label="Password" type='password' variant="outlined" />
     <TextField  onBlur={signinFormikObj.handleBlur}
            error={Boolean(signinFormikObj.touched.token && signinFormikObj.errors.token)}
            helperText={signinFormikObj.touched.token && signinFormikObj.errors.token}
         id="token" onChange={signinFormikObj.handleChange} value={signinFormikObj.values.token} label="Token" variant="outlined" />
    <Button type='submit' sx={{borderRadius: '20px' , padding:2}}>Sign up</Button>
     
       </form>
     </Paper>
    </Container>
  )
}
