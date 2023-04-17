import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { Authorize } from '@/components/Authorize';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSwr from 'swr';
import { ExamNextJsBackEnd, FoodItemDataGridItem } from '@/functions/swagger/ExamNextJsBackEnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAuthorizationContext } from '@/functions/AuthorizationContext';
import { useRouter } from 'next/router';
import { notification } from 'antd';
import Link from 'next/link';
import querystring from 'querystring';


const DisplayRestaurantFood: React.FC<{
    foodItem: FoodItemDataGridItem
    Id: string
}> = ({ foodItem, Id }) => {
    const [qty, setQty] = useState(1);

    const { accessToken } = useAuthorizationContext();
    async function addToCart() {
        const client = new ExamNextJsBackEnd('http://localhost:3000/api/be', {
            fetch(url, init) {
                if (init && init.headers) {
                    init.headers['Authorization'] = `Bearer ${accessToken}`
                }
                return fetch(url, init);
            }
        });
        try {
            await client.addToCart({
                restaurantId: Id.substring(3, Id.length),
                foodItemId: foodItem.id,
                qty: qty
            })
            notification.success({
                type: 'success',
                placement: 'bottomRight',
                message: 'Added to cart',
                description: `Added ${qty} ${foodItem.name} to cart`
            });
        }
        catch (err) {
            notification.error({
                type: 'error',
                placement: 'bottomRight',
                message: 'Failed to add to cart',
                description: String(err)
            });
        }
    }
    return (
        <div className='border border-gray-400 rounded-xl p-6 flex flex-col items-center bg-white shadow-lg'>
            <div className='bg-slate-400 h-[160px] w-full'></div>
            <div className='mt-4 font-bold'>{foodItem.name}</div>
            <div className='mt-4'>{'Rp.' + foodItem.price?.toLocaleString()}</div>
            <div className='mt-4 w-full flex'>
                <div className='flex-[1]'>
                    <input value={qty} type='number' onChange={t => setQty(t.target.valueAsNumber)}
                        className='block w-full p-1 text-sm rounded-md border-gray-500 border-solid border'></input>
                </div>
                <div className='flex-[3] pl-2'>
                    <button onClick={addToCart} className='block w-full p-1 text-sm rounded-md bg-blue-500 active:bg-blue-700 text-white' type='button'>
                        <FontAwesomeIcon icon={faCartPlus} className='mr-3'></FontAwesomeIcon>
                        Add to cart
                    </button>
                </div>

            </div>
        </div>
    );
}

const InnerIndexPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const cityDetailUri = id ? `/api/be/api/FoodItems/${id}` : undefined;
    const fetcher = useSwrFetcherWithAccessToken();
    const { data } = useSwr<FoodItemDataGridItem[]>(cityDetailUri, fetcher);
    return (
        <div>
            <Title>Home</Title>
            <Link href={`/order-summary/${querystring.stringify(router.query).substring(3, querystring.stringify(router.query).length)}`} className="inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
                <FontAwesomeIcon icon={faCheck} className='mr-3'></FontAwesomeIcon>
                Checkout
            </Link>
            <div className='grid grid-cols-5 gap-5'>
                {data?.map((x, i) => <DisplayRestaurantFood Id={querystring.stringify(router.query)} key={i} foodItem={x} />)}
            </div>
        </div>
    );
}

const IndexPage: Page = () => {
    return (
        <Authorize>
            <InnerIndexPage></InnerIndexPage>
        </Authorize>

    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;