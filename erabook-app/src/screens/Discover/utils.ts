import axios from 'axios';
import React, {useState, useEffect} from 'react';

export const [DATA, setDATA] = useState([]);

export const getBook = async () => {
   const response = await axios.get(
     'https://647860ae362560649a2da538.mockapi.io/BookList',
   );
   console.log(response.data);
   setDATA(response.data);
 };

 useEffect(() => {
   getBook();
 }, []);

 export const sections = [
   {title: 'Top Charts', dataKey: 'topCharts'},
   {title: 'Top Selling', dataKey: 'topSelling'},
   {title: 'Top Free', dataKey: 'topFree'},
   {title: 'Top New Releases', dataKey: 'topNewReleases'},
 ];