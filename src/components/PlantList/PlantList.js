import React, { useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import axios from 'axios';


function PlantList() {
    const dispatch = useDispatch();

    const plantList = useSelector(store => store.plantList);

    useEffect(() => {
        dispatch({ type: "FETCH_PLANT" });
      }, []);

    return (
        <div>
            <h3>This is the plant list</h3>
            <ul>
        {plantList.map((plantList) => (
          <pre key={plantList.id}>{plantList.name}</pre>
        ))}
      </ul>
        </div>
    );
}

export default PlantList;
