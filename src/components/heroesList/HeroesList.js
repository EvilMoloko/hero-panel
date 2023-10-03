import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { heroeDeleted, fetchHeroes } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { useCallback } from 'react';


const HeroesList = () => {

    const {heroes, heroesLoadingStatus} = useSelector(state => state.heroes);
    const {activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes())
        // eslint-disable-next-line
    }, []);

    const onHeroeDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(dispatch(heroeDeleted(id)))
    },[request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} onHeroeDelete={() => onHeroeDelete(id)}/>
        })
    }

    const filterHeroesList = (arr) => {
        if (activeFilter !== 'all') {
            return arr.filter(item => {
                return item.props.element === activeFilter ? item : null
            })
        } else {
            return arr
        }
    }

    const elements = filterHeroesList(renderHeroesList(heroes));
    console.log(elements);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;