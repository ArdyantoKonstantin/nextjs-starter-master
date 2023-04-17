import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { RestaurantDataGridItem, Restaurant } from '@/functions/swagger/ExamNextJsBackEnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import useSwr from 'swr';
import { Alert } from 'antd';
import Link from 'next/link';

const DisplayRestaurant: React.FC<{
    restaurant: RestaurantDataGridItem
}> = ({ restaurant }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg">
            <div className='bg-slate-400 h-[160px] w-full'></div>
            <div className="p-4">
                <div className="text-gray-800 font-semibold text-xl mb-2">{restaurant.name}</div>
                <div className='flex-[3] pl-2'>
                    <Link href={`/restaurant/${restaurant.id}`} className="inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
                        <FontAwesomeIcon icon={faSearch} className='mr-3'></FontAwesomeIcon>
                        Order
                    </Link>

                </div>
            </div>
        </div>
    );
}

const IndexPage: Page = () => {

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error } = useSwr<Restaurant[]>('/api/be/api/Restaurants', swrFetcher);

    return (
        <div>
            <Title>Choose Restaurant Page</Title>
            <h2 className='mb-5 text-3xl'>Manage Restaurants</h2>
            {Boolean(error) && <Alert type='error' message='Cannot get Restaurant data' description={String(error)}></Alert>}
            <div className='grid grid-cols-5 gap-5'>
                {data?.map((x, i) => <DisplayRestaurant key={i} restaurant={x}></DisplayRestaurant>)}
            </div>

        </div>

    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
