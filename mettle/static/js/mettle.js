(function(global) {

  var debug = true;

  var request = global.superagent;
  var log = function(txt) {
    if (debug) {
      console.log(txt);
    }
  };

  var Mettle = global.Mettle = {'components': {}};

  var WSPREFIX = function() {
    var loc = window.location, newUri;
    if (loc.protocol === "https:") {
        newUri = "wss:";
    } else {
        newUri = "ws:";
    }
    newUri += "//" + loc.host;
    return newUri;
  }();

  var API_ROOT = '/api';

  var getServicesURL = function() {
    return API_ROOT + '/services/';
  };

  var getServiceURL = function(serviceName) {
    return getServicesURL() + serviceName + '/';
  };

  var getPipelinesURL = function(serviceName) {
    return getServiceURL(serviceName) + 'pipelines/';
  };

  var getPipelineURL = function(serviceName, pipelineName) {
    return getPipelinesURL(serviceName) + pipelineName + '/';
  };

  var getRunsURL = function(serviceName, pipelineName) {
    return getPipelineURL(serviceName, pipelineName) + 'runs/';
  };

  var getRunURL = function(serviceName, pipelineName, runId) {
    return getRunsURL(serviceName, pipelineName) + runId + '/';
  };

  var getRunJobsURL = function(serviceName, pipelineName, runId) {
    return getRunURL(serviceName, pipelineName, runId) + 'jobs/';
  };

  var getJobLogURL = function(serviceName, pipelineName, runId, jobId, tail) {
    return getRunJobsURL(serviceName, pipelineName, runId) + jobId + '/logs/?tail=' + tail;
  };

  var getTargetJobsURL = function(serviceName, pipelineName, runId, target) {
    return getRunURL(serviceName, pipelineName, runId) + 'targets/' + target + '/jobs/';
  };

  Mettle.getServices = function (cb) {
    return request.get(getServicesURL(), cb);
  };

  Mettle.getServicesStream = function() {
    return new ReconnectingWebSocket(WSPREFIX + getServicesURL());
  };

  Mettle.getPipelines = function (serviceName, cb) {
    var url = getPipelinesURL(serviceName);
    return request.get(url, cb);
  };

  Mettle.getPipelinesStream = function(serviceName) {
    return new ReconnectingWebSocket(WSPREFIX + getPipelinesURL(serviceName));
  };

  Mettle.getRuns = function (serviceName, pipelineName, cb) {
    var url = getRunsURL(serviceName, pipelineName);
    return request.get(url, cb);
  };

  Mettle.getRunsStream = function(serviceName, pipelineName) {
    return new ReconnectingWebSocket(WSPREFIX + getRunsURL(serviceName, pipelineName));
  };

  Mettle.getRun = function (serviceName, pipelineName, runId, cb) {
    var url = getRunURL(serviceName, pipelineName, runId);
    return request.get(url, cb);
  };

  Mettle.getRunStream = function (serviceName, pipelineName, runId) {
    return new ReconnectingWebSocket(getRunURL(serviceName, pipelineName, runId));
  };

  Mettle.getRunJobsStream = function (serviceName, pipelineName, runId) {
    return new ReconnectingWebSocket(WSPREFIX + getRunJobsURL(serviceName, pipelineName, runId));
  };

  Mettle.getTargetJobs = function(serviceName, pipelineName, runId, target, cb) {
    var url = getTargetJobsURL(serviceName, pipelineName, runId, target);
    return request.get(url, cb);
  };

  Mettle.getTargetJobsStream = function(serviceName, pipelineName, runId, target) {
    var url = WSPREFIX + getTargetJobsURL(serviceName, pipelineName, runId, target);
    return new ReconnectingWebSocket(url);
  };

  Mettle.getJobLogStream = function(serviceName, pipelineName, runId, jobId, tail) {
    var url = WSPREFIX + getJobLogURL(serviceName, pipelineName, runId, jobId, tail); 
      return new ReconnectingWebSocket(url);
  };

})(window);
