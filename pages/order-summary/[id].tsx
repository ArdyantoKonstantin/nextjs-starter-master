import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { ExamNextJsBackEnd, CartDetailModel } from '@/functions/swagger/ExamNextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Modal } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSwr from 'swr';
import { Authorize } from '@/components/Authorize';

const ProductTableRow: React.FC<{
    cartItem: CartDetailModel,
    onDeleted: () => void
}> = ({ cartItem, onDeleted }) => {

    function onClickDelete() {
        Modal.confirm({
            title: `Confirm Delete`,
            content: `Delete product ${cartItem.foodItemName}?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                if (!cartItem?.id) {
                    return;
                }
                try {
                    const client = new ExamNextJsBackEnd('http://localhost:3000/api/be');
                    await client.deleteCart(cartItem.id);
                    onDeleted();
                } catch (err) {
                    console.error(err);
                    // feedbacknya bisa pakai antd notification
                }
            },
        });
    }

    return (
        <tr>
            <td className="border px-4 py-2">{cartItem.id}</td>
            <td className="border px-4 py-2">{cartItem.foodItemName}</td>
            <td className="border px-4 py-2">{cartItem.restaurantName}</td>
            <td className="border px-4 py-2">{cartItem.qty}</td>
            <td className="border px-4 py-2">{cartItem.price}</td>
            <td className="border px-4 py-2">
                <Link href={`/product/edit/${cartItem.id}`} className="inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
                    <FontAwesomeIcon className='mr-1' icon={faEdit}></FontAwesomeIcon>
                    Edit 
                </Link>
                <button onClick={onClickDelete} className="ml-1 py-1 px-2 text-xs bg-red-500 text-white rounded-lg">
                    <FontAwesomeIcon className='mr-1' icon={faRemove}></FontAwesomeIcon>
                    Delete
                </button>
            </td>
        </tr>
    );
};

const IndexPage: Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const CartUri = id ? `/api/be/api/Carts/${id}` : undefined;
    console.log(CartUri);
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error, mutate } = useSwr<CartDetailModel[]>(CartUri, swrFetcher);

    return (
        <Authorize>
            <Title>CheckOut</Title>
            <h2 className='mb-5 text-3xl'>CheckOut</h2>

            {Boolean(error) && <Alert type='error' message='Cannot get products data' description={String(error)}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Food Name</th>
                        <th className='px-4 py-2'>Restaurant</th>
                        <th className='px-4 py-2'>Quantity</th>
                        <th className='px-4 py-2'>Price</th>
                        <th className='px-4 py-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, i) => <ProductTableRow key={i} cartItem={x} onDeleted={() => mutate()}></ProductTableRow>)}
                </tbody>
            </table>
        </Authorize>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;