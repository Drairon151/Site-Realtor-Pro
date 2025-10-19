export default function CreateListingForm(){
    return (
        <form className="create-listing-form">
            <label className="create-listing-form_lable" htmlFor="title">Название обьявления</label>
            <input
                className="create-listing-form_input"
                name="title" 
                type="text" 

            />

            <label className="create-listing-form_lable" htmlFor="price">Цена</label>
            <input
                className="create-listing-form_input"
                name="price"
                type="number"

            />
            
            <label className="create-listing-form_lable" htmlFor="adress">Адрес</label>
            <input
                className="create-listing-form_input"
                name="adress"
                type="text"

            />

            <label className="create-listing-form_lable" htmlFor="city">Город</label>
            <input
                className="create-listing-form_input"
                name="city"
                type="text"

            />
            
            <label className="create-listing-form_lable" htmlFor="specs">Характеристики дома</label>
            <input
                className="create-listing-form_input"
                name="specs"
                type="text"

            />

            <label className="create-listing-form_lable" htmlFor="description">Описание обьявления</label>
            <textarea
                className="create-listing-form_input"
                name="description"
                maxLength={5000}
                rows={6}
            />
        </form>
    )
}