$("#id").typeahead({
    source: function(query, process) {
        return $.ajax({
            url: '/showoff/watermark/fetchTopics',
            type: 'post',
            data: {
                topicName: query
            },
            dataType: 'json',
            success: function(result) {
                // 这里省略resultList的处理过程，处理后resultList是一个字符串列表，                       
                // 经过process函数处理后成为能被typeahead支持的字符串数组，作为搜索的源                       
                return process(resultList);
            }
        });
    }
});


https://github.com/tcrosen/twitter-bootstrap-typeahead 官网
