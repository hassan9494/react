import { Fragment, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'
import { Button, Card, CardBody, Row, Col, Form, FormGroup, Input, Label, Badge, Collapse, Tooltip, Alert } from 'reactstrap'
import FormErrors from '@components/form-errors'
import { useForm } from 'react-hook-form'
import CardHeader from 'reactstrap/lib/CardHeader'
import { useModel, api } from '@data/use-setting'

export default () => {
    const { id } = useParams()
    const { data: responseData, update, loading, error, mutate } = useModel(1)
    const { register, errors, handleSubmit, control, setValue } = useForm()
    const [formErrors, setFormErrors] = useState(null)
    const [openSections, setOpenSections] = useState({})
    const [tooltipOpen, setTooltipOpen] = useState({})
    const [fixing, setFixing] = useState(false)
    const [fixResult, setFixResult] = useState(null)

    const toggleTooltip = (id) => {
        setTooltipOpen(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    // Extract data from the response
    const setting = responseData?.setting
    const monitoring = responseData?.elastic_monitoring
    const clusterHealth = monitoring?.cluster_health

    // Toggle section collapse
    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Set the default value when setting data is available
    useEffect(() => {
        if (setting && setting.value) {
            setValue('searchType', setting.value)
        }
    }, [setting, setValue])

    const onSubmit = async data => {
        try {
            await update(data)
            console.log('Submitted data:', data)
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    const handleFixClusterHealth = async () => {
        setFixing(true)
        setFixResult(null)

        try {
            // Use the api helper from use-setting
            const result = await api.fixClusterHealth()

            setFixResult({
                success: true,
                message: result.message || 'Cluster health fix initiated successfully',
                results: result.results
            })

            // Refresh the monitoring data after fixing
            setTimeout(() => {
                mutate()
            }, 2000)

        } catch (error) {
            setFixResult({
                success: false,
                message: error.response?.data?.message || 'Failed to fix cluster health',
                error: error.response?.data?.error
            })
        } finally {
            setFixing(false)
        }
    }

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'green': return 'success'
            case 'yellow': return 'warning'
            case 'red': return 'danger'
            case 'open': return 'success'
            case 'close': return 'secondary'
            default: return 'secondary'
        }
    }

    const needsFix = clusterHealth && (clusterHealth.status === 'yellow' || clusterHealth.status === 'red')

    if (loading) {
        return <div>Loading Elasticsearch monitoring data...</div>
    }

    if (error) {
        return <div>Error loading data: {error.message}</div>
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Settings' breadCrumbActive='Search Monitoring'/>
            <Row>
                <Col lg='10'>
                    {/* Search Type Settings */}
                    <Card>
                        <CardHeader className='p-1 d-flex justify-content-between align-items-center'>
                            Search Type Settings
                            <Button.Ripple color='success' type='submit' onClick={handleSubmit(onSubmit)}>
                                Save
                            </Button.Ripple>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <FormGroup tag="fieldset">
                                    <Label for='searchType'>Search Type</Label>
                                    <FormGroup check>
                                        <Input
                                            type='radio'
                                            name='searchType'
                                            id='normal'
                                            value='normal'
                                            innerRef={register({ required: true })}
                                            defaultChecked={setting?.value === 'normal'}
                                        />
                                        <Label for='normal' check>Normal</Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input
                                            type='radio'
                                            name='searchType'
                                            id='normalWithPriority'
                                            value='normalWithPriority'
                                            innerRef={register({ required: true })}
                                            defaultChecked={setting?.value === 'normalWithPriority'}
                                        />
                                        <Label for='normalWithPriority' check>Normal With Priority</Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Input
                                            type='radio'
                                            name='searchType'
                                            id='elastic'
                                            value='elastic'
                                            innerRef={register({ required: true })}
                                            defaultChecked={setting?.value === 'elastic'}
                                        />
                                        <Label for='elastic' check>Elastic</Label>
                                    </FormGroup>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>

                    {/* Fix Result Alert */}
                    {fixResult && (
                        <Alert color={fixResult.success ? 'success' : 'danger'} className='mt-3'>
                            <h6>{fixResult.success ? '✅ Success!' : '❌ Error'}</h6>
                            {fixResult.message}
                            {fixResult.results && (
                                <div className='mt-2'>
                                    <small>
                                        Replicas: {fixResult.results.replicas} |
                                        Cache: {fixResult.results.cache_clear} |
                                        Refresh: {fixResult.results.refresh}
                                    </small>
                                </div>
                            )}
                            {fixResult.error && (
                                <div className='mt-2'>
                                    <small>Error: {fixResult.error}</small>
                                </div>
                            )}
                        </Alert>
                    )}

                    {/* Elasticsearch Monitoring Cards */}
                    {monitoring && (
                        <>
                            {/* Cluster Health */}
                            <Card className='mt-3'>
                                <CardHeader className='d-flex justify-content-between align-items-center' style={{cursor: 'pointer'}}>
                                    <div onClick={() => toggleSection('cluster')}>
                                        📊 Cluster Health {openSections.cluster ? '▼' : '▶'}
                                    </div>
                                    {needsFix && (
                                        <Button
                                            color='warning'
                                            size='sm'
                                            onClick={handleFixClusterHealth}
                                            disabled={fixing}
                                        >
                                            {fixing ? 'Fixing...' : '🛠️ Fix Cluster Health'}
                                        </Button>
                                    )}
                                </CardHeader>
                                <Collapse isOpen={openSections.cluster}>
                                    <CardBody>
                                        {monitoring.cluster_health?.error ? (
                                            <div className='text-danger'>{monitoring.cluster_health.error}</div>
                                        ) : (
                                            <Row>
                                                <Col md={6}>
                                                    <div className='mb-3'>
                                                        <strong id='cluster-status'>Status:</strong>{' '}
                                                        <Badge color={getStatusBadgeColor(clusterHealth?.status)}>
                                                            {clusterHealth?.status}
                                                        </Badge>
                                                        <Tooltip placement='right' isOpen={tooltipOpen['cluster-status']} target='cluster-status' toggle={() => toggleTooltip('cluster-status')}>
                                                            {clusterHealth?.status === 'green' ? 'Perfect! Your search cluster is healthy' : clusterHealth?.status === 'yellow' ? 'Warning: Some data copies are missing. Click "Fix" to resolve.' : 'Critical: Some data is unavailable. Click "Fix" immediately.'
                                                            }
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='cluster-name'>Cluster:</strong> {clusterHealth?.cluster_name}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['cluster-name']} target='cluster-name' toggle={() => toggleTooltip('cluster-name')}>
                                                            Name of your Elasticsearch cluster
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='cluster-nodes'>Nodes:</strong> {clusterHealth?.number_of_nodes}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['cluster-nodes']} target='cluster-nodes' toggle={() => toggleTooltip('cluster-nodes')}>
                                                            Total number of servers in your search cluster
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='data-nodes'>Data Nodes:</strong> {clusterHealth?.number_of_data_nodes}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['data-nodes']} target='data-nodes' toggle={() => toggleTooltip('data-nodes')}>
                                                            Number of servers that actually store your product data
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className='mb-3'>
                                                        <strong id='active-shards'>Active Shards:</strong> {clusterHealth?.active_shards}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['active-shards']} target='active-shards' toggle={() => toggleTooltip('active-shards')}>
                                                            Number of data partitions that are currently working properly
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='unassigned-shards'>Unassigned Shards:</strong> {clusterHealth?.unassigned_shards}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['unassigned-shards']} target='unassigned-shards' toggle={() => toggleTooltip('unassigned-shards')}>
                                                            {clusterHealth?.unassigned_shards > 0 ? '⚠️ Data partitions that need assignment. Click "Fix" to resolve.' : 'Good! All data partitions are properly assigned'
                                                            }
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='pending-tasks'>Pending Tasks:</strong> {clusterHealth?.number_of_pending_tasks}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['pending-tasks']} target='pending-tasks' toggle={() => toggleTooltip('pending-tasks')}>
                                                            {clusterHealth?.number_of_pending_tasks > 5 ? 'Many waiting operations. Click "Fix" to clear cache and refresh.' : 'Normal number of waiting operations in the cluster'
                                                            }
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='health-percent'>Health %:</strong> {clusterHealth?.active_shards_percent_as_number}%
                                                        <Tooltip placement='right' isOpen={tooltipOpen['health-percent']} target='health-percent' toggle={() => toggleTooltip('health-percent')}>
                                                            Percentage of data partitions that are active and healthy
                                                        </Tooltip>
                                                    </div>
                                                </Col>

                                                {/* Explanation for when to use the fix button */}
                                                {needsFix && (
                                                    <Col md={12} className='mt-3'>
                                                        <Alert color='info'>
                                                            <h6>🛠️ When to use "Fix Cluster Health":</h6>
                                                            <ul className='mb-0'>
                                                                <li>Status is <strong>Yellow</strong> (usually missing replica copies)</li>
                                                                <li>Status is <strong>Red</strong> (critical data unavailability)</li>
                                                                <li>High number of <strong>Unassigned Shards</strong></li>
                                                                <li>Many <strong>Pending Tasks</strong> causing slow performance</li>
                                                            </ul>
                                                            <small className='text-muted'>
                                                                The fix will: Set replicas to 0, clear cache, and refresh indices
                                                            </small>
                                                        </Alert>
                                                    </Col>
                                                )}
                                            </Row>
                                        )}
                                    </CardBody>
                                </Collapse>
                            </Card>

                            {/* Last Products Index Stats */}
                            <Card className='mt-3'>
                                <CardHeader onClick={() => toggleSection('stats')} style={{cursor: 'pointer'}}>
                                    📈 Last Products Index Statistics {openSections.stats ? '▼' : '▶'}
                                </CardHeader>
                                <Collapse isOpen={openSections.stats}>
                                    <CardBody>
                                        {monitoring.last_products_stats?.error ? (
                                            <div className='text-danger'>{monitoring.last_products_stats.error}</div>
                                        ) : (
                                            <Row>
                                                <Col md={6}>
                                                    <h6>📄 Documents</h6>
                                                    <div className='mb-3'>
                                                        <strong id='total-docs'>Total Documents:</strong> {monitoring.last_products_stats?.indices?.last_products?.total?.docs?.count?.toLocaleString()}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['total-docs']} target='total-docs' toggle={() => toggleTooltip('total-docs')}>
                                                            Total number of product records stored in the search index
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='deleted-docs'>Deleted Documents:</strong> {monitoring.last_products_stats?.indices?.last_products?.total?.docs?.deleted?.toLocaleString()}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['deleted-docs']} target='deleted-docs' toggle={() => toggleTooltip('deleted-docs')}>
                                                            Number of products that have been removed (marked for cleanup)
                                                        </Tooltip>
                                                    </div>

                                                    <h6 className='mt-4'>💾 Storage</h6>
                                                    <div className='mb-3'>
                                                        <strong id='index-size'>Index Size:</strong> {(monitoring.last_products_stats?.indices?.last_products?.total?.store?.size_in_bytes / 1024 / 1024).toFixed(2)} MB
                                                        <Tooltip placement='right' isOpen={tooltipOpen['index-size']} target='index-size' toggle={() => toggleTooltip('index-size')}>
                                                            Disk space used by your product search index
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='total-size'>Total Size:</strong> {(monitoring.last_products_stats?.indices?.last_products?.total?.store?.size_in_bytes / 1024 / 1024 / 1024).toFixed(2)} GB
                                                        <Tooltip placement='right' isOpen={tooltipOpen['total-size']} target='total-size' toggle={() => toggleTooltip('total-size')}>
                                                            Total disk space including overhead and metadata
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <h6>⚡ Indexing Performance</h6>
                                                    <div className='mb-3'>
                                                        <strong id='index-time'>Index Time:</strong> {monitoring.last_products_stats?.indices?.last_products?.total?.indexing?.index_time_in_millis}ms
                                                        <Tooltip placement='right' isOpen={tooltipOpen['index-time']} target='index-time' toggle={() => toggleTooltip('index-time')}>
                                                            Total time spent adding/updating products in milliseconds
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='index-total'>Index Operations:</strong> {monitoring.last_products_stats?.indices?.last_products?.total?.indexing?.index_total?.toLocaleString()}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['index-total']} target='index-total' toggle={() => toggleTooltip('index-total')}>
                                                            Total number of times products were added or updated
                                                        </Tooltip>
                                                    </div>

                                                    <h6 className='mt-4'>🔍 Search Performance</h6>
                                                    <div className='mb-3'>
                                                        <strong id='query-time'>Query Time:</strong> {monitoring.last_products_stats?.indices?.last_products?.total?.search?.query_time_in_millis}ms
                                                        <Tooltip placement='right' isOpen={tooltipOpen['query-time']} target='query-time' toggle={() => toggleTooltip('query-time')}>
                                                            Total time spent searching for products in milliseconds
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='query-total'>Query Count:</strong> {monitoring.last_products_stats?.indices?.last_products?.total?.search?.query_total?.toLocaleString()}
                                                        <Tooltip placement='right' isOpen={tooltipOpen['query-total']} target='query-total' toggle={() => toggleTooltip('query-total')}>
                                                            Total number of search queries performed by users
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}
                                    </CardBody>
                                </Collapse>
                            </Card>

                            {/* Memory Usage */}
                            <Card className='mt-3'>
                                <CardHeader onClick={() => toggleSection('memory')} style={{cursor: 'pointer'}}>
                                    💾 Memory & Cache Usage {openSections.memory ? '▼' : '▶'}
                                </CardHeader>
                                <Collapse isOpen={openSections.memory}>
                                    <CardBody>
                                        {monitoring.nodes_stats?.error ? (
                                            <div className='text-danger'>{monitoring.nodes_stats.error}</div>
                                        ) : (
                                            <Row>
                                                <Col md={6}>
                                                    <h6>🖥️ JVM Memory (Java Virtual Machine)</h6>
                                                    <div className='mb-3'>
                                                        <strong id='heap-used'>Heap Memory Used:</strong> {(monitoring.nodes_stats?.nodes[Object.keys(monitoring.nodes_stats?.nodes)[0]]?.jvm?.mem?.heap_used_in_bytes / 1024 / 1024).toFixed(2)} MB
                                                        <Tooltip placement='right' isOpen={tooltipOpen['heap-used']} target='heap-used' toggle={() => toggleTooltip('heap-used')}>
                                                            Memory currently used by the search engine (Elasticsearch runs on Java)
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='heap-max'>Heap Memory Max:</strong> {(monitoring.nodes_stats?.nodes[Object.keys(monitoring.nodes_stats?.nodes)[0]]?.jvm?.mem?.heap_max_in_bytes / 1024 / 1024).toFixed(2)} MB
                                                        <Tooltip placement='right' isOpen={tooltipOpen['heap-max']} target='heap-max' toggle={() => toggleTooltip('heap-max')}>
                                                            Maximum memory available for the search engine
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='non-heap'>Non-Heap Memory:</strong> {(monitoring.nodes_stats?.nodes[Object.keys(monitoring.nodes_stats?.nodes)[0]]?.jvm?.mem?.non_heap_used_in_bytes / 1024 / 1024).toFixed(2)} MB
                                                        <Tooltip placement='right' isOpen={tooltipOpen['non-heap']} target='non-heap' toggle={() => toggleTooltip('non-heap')}>
                                                            Memory used for Java class definitions and other overhead
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <h6>🚀 Cache Memory</h6>
                                                    <div className='mb-3'>
                                                        <strong id='fielddata-cache'>Fielddata Cache:</strong> {(monitoring.last_products_stats?.indices?.last_products?.total?.fielddata?.memory_size_in_bytes / 1024 / 1024).toFixed(2)} MB
                                                        <Tooltip placement='right' isOpen={tooltipOpen['fielddata-cache']} target='fielddata-cache' toggle={() => toggleTooltip('fielddata-cache')}>
                                                            Memory used to speed up sorting and aggregation of product data
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='query-cache'>Query Cache:</strong> {(monitoring.last_products_stats?.indices?.last_products?.total?.query_cache?.memory_size_in_bytes / 1024 / 1024).toFixed(2)} MB
                                                        <Tooltip placement='right' isOpen={tooltipOpen['query-cache']} target='query-cache' toggle={() => toggleTooltip('query-cache')}>
                                                            Memory used to store frequent search results for faster response
                                                        </Tooltip>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <strong id='request-cache'>Request Cache:</strong> {(monitoring.last_products_stats?.indices?.last_products?.total?.request_cache?.memory_size_in_bytes / 1024 / 1024).toFixed(2)} MB
                                                        <Tooltip placement='right' isOpen={tooltipOpen['request-cache']} target='request-cache' toggle={() => toggleTooltip('request-cache')}>
                                                            Memory used to cache entire search requests
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}
                                    </CardBody>
                                </Collapse>
                            </Card>

                            {/* Index Settings */}
                            <Card className='mt-3'>
                                <CardHeader onClick={() => toggleSection('settings')} style={{cursor: 'pointer'}}>
                                    ⚙️ Index Configuration {openSections.settings ? '▼' : '▶'}
                                </CardHeader>
                                <Collapse isOpen={openSections.settings}>
                                    <CardBody>
                                        {monitoring.last_products_settings?.error ? (
                                            <div className='text-danger'>{monitoring.last_products_settings.error}</div>
                                        ) : (
                                            <div>
                                                <div className='mb-3'>
                                                    <strong id='shards-count'>Shards:</strong> {monitoring.last_products_settings?.last_products?.settings?.index?.number_of_shards}
                                                    <Tooltip placement='right' isOpen={tooltipOpen['shards-count']} target='shards-count' toggle={() => toggleTooltip('shards-count')}>
                                                        Number of data partitions for your products (affects performance and parallel processing)
                                                    </Tooltip>
                                                </div>

                                                <div className='mb-3'>
                                                    <strong id='replicas-count'>Replicas:</strong> {monitoring.last_products_settings?.last_products?.settings?.index?.number_of_replicas}
                                                    <Tooltip placement='right' isOpen={tooltipOpen['replicas-count']} target='replicas-count' toggle={() => toggleTooltip('replicas-count')}>
                                                        Number of backup copies of your data (for safety and read performance)
                                                    </Tooltip>
                                                </div>

                                                <div className='mb-3'>
                                                    <strong id='refresh-interval'>Refresh Interval:</strong> {monitoring.last_products_settings?.last_products?.settings?.index?.refresh_interval}
                                                    <Tooltip placement='right' isOpen={tooltipOpen['refresh-interval']} target='refresh-interval' toggle={() => toggleTooltip('refresh-interval')}>
                                                        How often new products become searchable (1s = every second)
                                                    </Tooltip>
                                                </div>

                                                <div className='mb-3'>
                                                    <strong id='index-status'>Index Status:</strong>{' '}
                                                    <Badge color={getStatusBadgeColor(monitoring.last_products_settings?.last_products?.settings?.index?.verified_before_close)}>
                                                        {monitoring.last_products_settings?.last_products?.settings?.index?.verified_before_close || 'open'}
                                                    </Badge>
                                                    <Tooltip placement='right' isOpen={tooltipOpen['index-status']} target='index-status' toggle={() => toggleTooltip('index-status')}>
                                                        Whether the product index is open (accepting data) or closed
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        )}
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </>
                    )}
                </Col>
            </Row>
        </Fragment>
    )
}