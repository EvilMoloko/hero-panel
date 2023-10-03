import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook"

import { activeFilterChanged, fetchFilters } from "./filtersSlice";
import Spinner from "../spinner/Spinner";
import classNames from "classnames";

const HeroesFilters = () => {
    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchFilters(request))
        // eslint-disable-next-line                                                                                 
    },[])


    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры отсутствуют</h5>
        } else {
            return arr.map(({name,text,className}) => {
                let classes = classNames('btn', className,
                {'active': name === activeFilter})
                return (
                    <button
                        onClick={(e) => dispatch(activeFilterChanged(e.target.id))}
                        key={name}
                        id={name}
                        className={`${classes}`}>
                            {text}</button>)
            })
        }
    };



    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;