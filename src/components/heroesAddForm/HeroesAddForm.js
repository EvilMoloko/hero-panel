import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useHttp } from "../../hooks/http.hook";
import { useSelector, useDispatch } from "react-redux";
import { heroeCreated } from "../heroesList/heroesSlice";
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [element, setElement] = useState('all');

    const {filters} = useSelector(state => state.filters);
    const {request} = useHttp();
    const dispatch = useDispatch();

    const addNewHero = (e) => {
        e.preventDefault();
        const heroe = {
            "id": uuidv4(),
            "name": name,
            "description": desc,
            "element": element
        };
        request("http://localhost:3001/heroes", "POST", JSON.stringify(heroe))
            .then(dispatch(heroeCreated(heroe)))
            .catch(err => console.log(err));
        e.target.reset();
    }

    const renderFilters = (arr) => {
        return arr.map(({name, text}) => {
            if (name === 'all') {
                return <option key={name} value={name}>Я владею элементом...</option>
            } else {
                return (
                    <option key={name} value={name}>{text}</option>
                )
            }

        })
    } 

    const elements = renderFilters(filters)

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={addNewHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    onBlur={(e) => setName(e.currentTarget.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    onBlur={(e) => setDesc(e.currentTarget.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label fs-4">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    onChange={(e) => setElement(e.target.value)}>
                    {elements}
                </select>
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                >Создать</button>
        </form>
    )
}

export default HeroesAddForm;