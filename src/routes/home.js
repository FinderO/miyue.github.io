import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styled from 'styled-components'
import { Button, Icon, Transition } from 'semantic-ui-react'
import PostCard from '../components/postCard'
import Loading from '../components/loading'

import config from '../config'
const { duration, transitions } = config

const Container = styled.div`
  position: relative;
  min-height: 780px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1200px) {
    margin-bottom: 60px;
  }
`

const PostList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`

const StyledButton = styled(Button)`
  position: absolute;
  margin: 0!important;
  width: 150px;
  background: transparent!important;
  @media (max-width: 1200px) {
    display: none!important;
  }
`

const StyledLeftButton = StyledButton.extend`
  top: 50%;
  left: 0;
  transform: translate(-100%, -50%);
`

const StyledRightButton = StyledButton.extend`
  top: 50%;
  right: 0;
  transform: translate(100%, -50%);
`

const StyledMobileButton = StyledButton.extend`
  position: absolute;
  margin: 0!important;
  padding: 0!important;
  font-size: 80px!important;
  background: transparent!important;
  display: none!important;
  bottom: 0;
  transform: translate(0, 100%);
  @media (max-width: 1200px) {
    display: inline-block!important;
  }
`

const StyledIcon = styled(Icon)`
  height: 100%!important;
  color: rgba(255, 255, 255, .8);
`

class Home extends PureComponent {
  componentDidMount() {
    // 获取文章总数
    this.props.dispatch({
      type: 'postList/queryTotal',
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'postList/reset',
    })
  }

  // 前一页
  prev = () => {
    this.props.dispatch({
      type: 'postList/queryList',
      payload: {
        queryType: 'prev',
      }
    })
  }

  // 后一页
  next = () => {
    this.props.dispatch({
      type: 'postList/queryList',
      payload: {
        queryType: 'next',
      }
    })
  }

  // hover 触发对话
  _handleMouseOver = ({ type, title }) => {
    const prevTips = "要到上一页看看吗？(●'◡'●)"
    const nextTips = "要到下一页看看吗？(●'◡'●)"
    let tips = ''
    if (title) {
      tips = `要去看看<font color=#f6f> ${title} </font>吗？`
    } else {
      tips = type === 'prev' ? prevTips : nextTips
    }
    this.props.dispatch({
      type: 'appModel/showTips',
      payload: {
        tips,
      }
    })
  }

  // 动画结束
  onHide = () => {
    this.props.dispatch({
      type: 'postList/update',
      payload: {
        onHide: true,
      }
    })
  }

  renderCard = () => {
    const { postList, times } = this.props
    if (postList && postList.length > 0) {
      const cardList = postList.map((o, i) => {
        return (
          <PostCard key={o.id} { ...o } time={times ? times[i] : 1} gotoCat={this.gotoCat} _handleMouseOver={this._handleMouseOver}/>
        )
      })
      return cardList
    }
  }

  render() {
    const { loading, onHide } = this.props
    return (
      <Container>
        <StyledLeftButton icon onClick={this.prev} onMouseOver={() => this._handleMouseOver({ type: 'prev' })}>
          <StyledIcon name='angle double left' size='massive' />
        </StyledLeftButton>
        <StyledRightButton icon onClick={this.next} onMouseOver={() => this._handleMouseOver({ type: 'next' })}>
          <StyledIcon name='angle double right' size='massive'/>
        </StyledRightButton>
        <Transition visible={!loading} animation={transitions.home || 'scale'} duration={duration} onHide={this.onHide}>
          <div>
            <PostList>
              {this.renderCard()}
            </PostList>
          </div>
        </Transition>
        {loading && onHide &&
          <Loading />
        }
        <StyledMobileButton icon onClick={this.next}>
          <StyledIcon name='angle double down'/>
        </StyledMobileButton>
      </Container>
    )
  }
}

export default connect(({ postList }) => ({ ...postList }))(Home)
