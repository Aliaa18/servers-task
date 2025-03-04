'use client'
import { Button, Container, Paper, TextField } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import * as Yup from 'yup';
import React, { useContext } from 'react';
import { UserToken } from '../Context/UserToken'
export default function Page() {
     const router = useRouter()
     const { setUserToken } = useContext(UserToken);
     const validationSchema = Yup.object({
        email: Yup.string()
          .email("Invalid email format")
          .required("Email is required"),
          
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least one uppercase, one lowercase, one digit, and one special character"
          )
          .required("Password is required"),
          
       
      });
  const signinFormikObj=   useFormik({
    initialValues:{
       email:'',
       password:'',
       
        
    },validationSchema,
    onSubmit: async function(values){
        try {
            // GET request to fetch user data filtered by email.
            const { data } = await axios.get(
              `https://674cacb754e1fca9290d4668.mockapi.io/servers?email=${values.email}`,
              { headers: { 'Content-Type': 'application/json' } }
            );
            console.log('Fetched data:', data);
            if (data.length > 0) {
              const user = data[0];
              // Compare the password from the form with the fetched user's password
              if (user.password === values.password) {
                // If the password matches, store the token in localStorage
                localStorage.setItem('token', user.token);
                  setUserToken(user.token);
                // Navigate to the "home" page
                router.push('/');
              } else {
                console.error('Password mismatch');
              }
            } else {
              console.error('User not found');
            }
          } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              console.error('Error during login:', error.response?.data || error.message);
            } else {
              console.error('Unexpected error:', error);
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
       <Button type='submit' sx={{borderRadius: '20px' , padding:2}}>login</Button>
     
       </form>
     </Paper>
    </Container>
  )
}
