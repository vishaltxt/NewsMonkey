import React, { Component } from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
//import { render } from 'react-dom'
import InfiniteScroll from 'react-infinite-scroll-component'

export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 9,
        category: 'general',
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }
    capitalizerFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    constructor(props) {
        super(props);
        // console.log("hello i am a constructor from news component");
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalizerFirstLetter(this.props.category)} - NewsMonkey`;
    }
    //async updateNews() {
    //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&
    //   apiKey=a7edc08cb8b94e358ac343cd3140aabf&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    //this.setState({ loading: true })
    //let data = await fetch(url);
    //let parsedData = await data.json();
    //  console.log(parsedData);
    //this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false })
    //}
    async componentDidMount() {    //it is a lifecycle method
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a7edc08cb8b94e358ac343cd3140aabf&page=1&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true })
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false })
        //this.state.updateNews();

    }
    handlePreviousClick = async () => {
        // console.log("previous");
        this.props.setProgress(0);
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a7edc08cb8b94e358ac343cd3140aabf&page=${this.state.page - 1} &pageSize=${this.props.pageSize}`;
        this.setState({ loading: true })
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setstate({
            page: this.state.page - 1,
            articles: parsedData.articles,
            loading: false
        })
        this.props.setProgress(100);
        //  this.setState({ page: this.state.page - 1 })
        // this.state.updateNews();
    }
    handleNextClick = async () => {
        //console.log("next");
        this.props.setProgress(0);
        if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=a7edc08cb8b94e358ac343cd3140aabf&page=${this.state.page + 1} &pageSize=${this.props.pageSize}`;
            this.setState({ loading: true })
            let data = await fetch(url);
            let parsedData = await data.json();
            this.setState({
                page: this.state.page + 1,
                articles: parsedData.articles,
                loading: false
            })
            this.props.setProgress(100);
        }
        //this.setState({ page: this.state.page + 1 })
        //this.updateNews();
    }
    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 })
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&
        apiKey=a7edc08cb8b94e358ac343cd3140aabf&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        // this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        //console.log(parsedData);
        this.setState({ articles: this.state.articles.concat(parsedData.articles), totalResults: parsedData.totalResults })
    }
    render() {
        return (
            <>
                <h1 className='text-center' style={{ margin: '35px 0px' }} >NewsMonkey - Top {this.capitalizerFirstLetter(this.props.category)} Headlines</h1>
                {this.state.loading && <Spinner />}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner />}
                >
                    <div className="container">
                        <div className='row'>
                            {this.state.articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    <Newsitem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePreviousClick}>&larr; Previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>

            </>
        )
    }
}
export default News
