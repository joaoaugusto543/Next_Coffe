function assessment(comments){

    const percentageOneStar=comments.filter((comment)=>comment.assessment === 1).length * 100 / comments.length
    const percentageTwoStars=comments.filter((comment)=>comment.assessment === 2).length * 100 / comments.length
    const percentageThreeStars=comments.filter((comment)=>comment.assessment === 3).length * 100 / comments.length
    const percentageFourStars=comments.filter((comment)=>comment.assessment === 4).length * 100 / comments.length
    const percentageFiveStars=comments.filter((comment)=>comment.assessment === 5).length * 100 / comments.length

    const initialValue = 0;

    let total

    if(comments.length !==0){
        total = (comments.reduce((accumulator, currentValue) => accumulator + currentValue.assessment, initialValue)/comments.length).toFixed(1).replace('.',',')
    }else{
        total=0
    }

    return {percentageFiveStars,percentageFourStars,percentageThreeStars,percentageTwoStars,percentageOneStar,total}
}

export default assessment