import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";
import { useEffect, useState } from "react";

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places
// You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing
const Product = ({ id, name, availableCount, price, addTotal }) => {
  const [availableCounth, setAvailableCountH] = useState(availableCount);
  const [orderedQuantityh, setOrderedQuantityH] = useState(0);
  const [totalh, setTotalH] = useState(0);
  const handleAdd = () => {
    if (availableCounth > 0) {
      setOrderedQuantityH(orderedQuantityh + 1);
      setAvailableCountH(availableCounth - 1);
    }
  };
  const handleRemove = () => {
    if (orderedQuantityh > 0) {
      setOrderedQuantityH(orderedQuantityh - 1);
      setAvailableCountH(availableCounth + 1);
    } else {
      setOrderedQuantityH(0);
    }
  };
  useEffect(() => {
    setTotalH(price * orderedQuantityh);
    addTotal({ id: id, total: price * orderedQuantityh });
  }, [orderedQuantityh, price, addTotal, id]);
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCounth}</td>
      <td>${price}</td>
      <td>{orderedQuantityh}</td>
      <td>${totalh.toFixed(2)}</td>
      <td>
        <button
          disabled={availableCounth === 0 ? true : false}
          onClick={() => handleAdd()}
          className={styles.actionButton}
        >
          +
        </button>
        <button
          disabled={orderedQuantityh === 0 ? true : false}
          onClick={() => handleRemove()}
          className={styles.actionButton}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState([]);
  useEffect(() => {
    getProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);
  const handleaddTotal = ({ id, total }) => {
    console.log("Here Now", { id, total });
    console.log("Here Time", cart);
    let i = 0;
    if (cart.length !== undefined) {
      while (i < cart.length) {
        if (cart[i].id === id) {
          cart[i].total = total;
          break;
        }
        i++;
      }
      if (i === cart.length) {
        let tab = cart;
        tab.push({ id: id, total: total });
        setCart(tab);
      }
    }
    let sum = 0;
    for (let i = 0; i < cart.length; i++) {
      sum = sum + cart[i].total;
    }
    setTotal(sum);
  };

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        {loading && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((item, index) => {
                return (
                  <Product
                    key={index}
                    id={item.id}
                    name={item.name}
                    availableCount={item.availableCount}
                    price={item.price}
                    addTotal={handleaddTotal}
                  />
                );
              })}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>
          {total > 1000 ? `discount ${((total * 10) / 100).toFixed(2)}` : null}
        </p>
        <p>
          Total: ${" "}
          {total > 1000
            ? `${((total * 90) / 100).toFixed(2)}`
            : `${total.toFixed(2)}`}
        </p>
      </main>
    </div>
  );
};

export default Checkout;
