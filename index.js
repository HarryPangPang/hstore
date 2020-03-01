import HStore from './src'

 HStore({
     type:'init',
     data:{
        page1:{
            hsa:1,
            counts:[1,2,4],
            sub:{
                sub_sub:{
                    a:1,
                    c:2
                }
            }
        },
        page2:{}
    }
 })
 HStore(
    {type:"add",data:{
        path:"page1.test",
        value:21
    }}
     )
    //  HStore(
    //     {type:"delete",data:{
    //         path:"page1.test",
    //         value:21
    //     }}
    //      )
         HStore(
            {type:"update",data:{
                path:"page1.test",
                value:10000
            }}
             )