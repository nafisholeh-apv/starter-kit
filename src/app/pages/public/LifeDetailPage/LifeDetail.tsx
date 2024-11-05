import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Row, Col, Descriptions, Typography, Skeleton, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetLifeByIdQuery } from '../../../api';
import InternalErrorResult from '../../../components/results/InternalErrorResult';

const PageTitle = styled(Typography.Title)`
    margin-bottom: 0 !important;
    margin-left: 0.25em;
`;

const CustomDescriptions = styled(Descriptions).attrs(props => ({
    labelStyle: {
        color: props.theme.antd['text-color-secondary'],
    },
}))``;

const LifeDetail = () => {
    const { t } = useTranslation('lives');
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, loading, error } = useGetLifeByIdQuery({ variables: { lifeId: id } });

    if (!loading && error) {
        return <InternalErrorResult />;
    }

    const readableBirthday = t('common:formats.date', { date: new Date(data?.getLife?.birthday) });
    const readableHobbies = (data?.getLife?.hobbies || []).join(', ');

    return (
        <Row gutter={[24, 24]}>
            <Col span={24}>
                {loading ? (
                    <Skeleton.Input style={{ width: 360 }} active />
                ) : (
                    <Row align="middle">
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} shape="circle" />
                        <PageTitle>{t('titles.detailPage', { id: data?.getLife?.fullName })}</PageTitle>
                    </Row>
                )}
            </Col>
            <Col md={16} xs={24}>
                <Card bordered={false} loading={loading} title={t('titles.general')}>
                    <CustomDescriptions layout="vertical">
                        <Descriptions.Item label={t('titles.title')} span={3}>
                            {data?.getLife?.title}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('titles.birthday')}>{readableBirthday}</Descriptions.Item>
                        <Descriptions.Item label={t('titles.id')}>
                            <Typography.Paragraph copyable>{data?.getLife?.id}</Typography.Paragraph>
                        </Descriptions.Item>
                    </CustomDescriptions>
                </Card>
            </Col>
            <Col md={8} xs={24}>
                <Card bordered={false} loading={loading} title={t('titles.hobbies')}>
                    <Descriptions layout="vertical">
                        <Descriptions.Item>{readableHobbies}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
            <Col span={24}>
                <Card bordered={false} loading={loading} title={t('titles.description')}>
                    <Descriptions>
                        <Descriptions.Item>
                            <Typography.Paragraph>{data?.getLife?.description}</Typography.Paragraph>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
        </Row>
    );
};

export default LifeDetail;
