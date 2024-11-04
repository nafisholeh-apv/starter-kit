import { Empty, ConfigProvider, Table, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useGetLivesQuery } from '../../../api';
import InternalErrorResult from '../../../components/results/InternalErrorResult';

const LivesList = () => {
    const { t } = useTranslation('lives');
    const { loading, error, data } = useGetLivesQuery();

    const columns = useMemo(
        () => [
            Table.EXPAND_COLUMN,
            {
                title: t('titles.fullName'),
                dataIndex: 'fullName',
                key: 'fullName',
                render: (text, record) => <Link to={`/lives/${record.id}`}>{text}</Link>,
            },
            {
                title: t('titles.title'),
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: t('titles.id'),
                dataIndex: 'id',
                key: 'id',
            },
        ],
        [t]
    );

    const renderFallbackContent = () =>
        error ? (
            <InternalErrorResult />
        ) : (
            <Empty
                description={<Typography.Text type="secondary">{t('state.empty')}</Typography.Text>}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );

    return (
        <ConfigProvider renderEmpty={renderFallbackContent}>
            <Typography.Title>{t('titles.listPage')}</Typography.Title>
            <Table columns={columns} dataSource={data?.listLives} loading={loading} rowKey="id" />
        </ConfigProvider>
    );
};

export default LivesList;
