export function generateNewId(){
  return Math.random().toString(36).substr(2, 9);
}

export const startTiming = function(tag){
  console.log(`==> Entering timing ${tag ? tag : (new Error()).stack.match(/at (\S+)/g)[1].slice(3)} : `);
  return {
    tag: tag ? tag : (new Error()).stack.match(/at (\S+)/g)[1].slice(3),
    enterTime: Date.now()
  }
}

export const endTiming = function(infos){
  console.log(`action ${infos.tag} finished, execution time : ${Date.now() - infos.enterTime}ms <==`);
}