import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from 'yup';
import axios from 'axios';

const UserForm = ({ values, errors, touched, status }) => {
   const [users, setUsers] = useState();

   useEffect(() => {
      console.log('status has changed', status);
      status && setUsers(users => [...users, status]);
   }, [status]);

   return (
      <div className='user-form'>
         <Form>
            <Field type='text' name='name' placeholder='enter name' />
            {touched.name && errors.name && (
               <p className='errors'>{errors.name}</p>
            )}

            <Field type='email' name='email' placeholder='enter email' />
            {touched.email && errors.email && (
               <p className='errors'>{errors.email}</p>
            )}

            <Field type='password' name='password' placeholder='enter password' />
            {touched.password && errors.password && (
               <p className='errors'>{errors.password}</p>
            )}

            <label className='checkbox-container'>
               Terms of Service
               <Field
                  type='checkbox'
                  name='tos'
                  checked={values.tos}
               />
               <span className='checkmark' />
            </label>

            <button type='submit'>Submit</button>
         </Form>

         {users.map(user => {
            return (
               <ul key={user.name}>
                  <li>{user.name}</li>
                  <li>{user.email}</li>
                  <li>{user.password}</li>
                  <li>{user.tos}</li>
               </ul>
            )
         })}
      </div>
   );
};

const FormikUserForm = withFormik({
   mapPropsToValues(props) {
      return {
         name: props.name || '',
         email: props.email || '',
         password: props.password || '',
         tos: props.tos || false,
      };
   },

   validationSchema: Yup.object().shape({
      name: Yup.string()
         .required('Your name is required'),
      email: Yup.string()
         .required('Email input required'),
      password: Yup.string()
         .min(6, 'Password must be 6 characters or longer')
         .required('A password is required')
   }),

   handleSubmit(values, { setStatus }) {
      console.log('submitting', values);
      axios
      .post('https://regress.in/api/users', values)
      .then(res => {
        console.log('success', res);
        setStatus(res.data);
      })
      .catch(err => console.log(err.response));
   },
})(UserForm);

export default FormikUserForm;