import axios from 'axios';  
import { useState } from 'react';

export default ({url, method, body, onSuccess}) => {
  const [errors, setErrors] = useState([]);
  const doRequest = async () => {
    try {
      setErrors([]);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      console.log(response.data);
      return response.data;
    } catch (error) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Errors:</h4>
          <ul className="my-0">
            {error.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
          <br/>    
        </div>
      );
    }
  };

  return { doRequest, errors };
};