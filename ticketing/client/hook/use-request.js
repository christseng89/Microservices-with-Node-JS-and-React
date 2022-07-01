import axios from 'axios';  
import { useState } from 'react';

export default ({url, method, body}) => {
  const [errors, setErrors] = useState([]);
  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);
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
};