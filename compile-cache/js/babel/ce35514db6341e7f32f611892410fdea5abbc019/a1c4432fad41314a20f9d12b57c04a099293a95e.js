"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.replaceTag = replaceTag;
exports.replaceTags = replaceTags;
var tags = {

  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

function replaceTag(tag) {

  return tags[tag];
}

function replaceTags(str) {

  if (!str) {

    return '';
  }

  return str.replace(/[&<>]/g, replaceTag);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Jzb3RvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1oZWxwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7O0FBRVosSUFBTSxJQUFJLEdBQUc7O0FBRVgsS0FBRyxFQUFFLE9BQU87QUFDWixLQUFHLEVBQUUsTUFBTTtBQUNYLEtBQUcsRUFBRSxNQUFNO0NBQ1osQ0FBQzs7QUFFSyxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUU7O0FBRTlCLFNBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ2xCOztBQUVNLFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTs7QUFFL0IsTUFBSSxDQUFDLEdBQUcsRUFBRTs7QUFFUixXQUFPLEVBQUUsQ0FBQztHQUNYOztBQUVELFNBQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7Q0FDMUMiLCJmaWxlIjoiL2hvbWUvcnNvdG8vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmNvbnN0IHRhZ3MgPSB7XG5cbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0Oydcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlVGFnKHRhZykge1xuXG4gIHJldHVybiB0YWdzW3RhZ107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlVGFncyhzdHIpIHtcblxuICBpZiAoIXN0cikge1xuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bJjw+XS9nLCByZXBsYWNlVGFnKTtcbn1cbiJdfQ==
//# sourceURL=/home/rsoto/.atom/packages/atom-ternjs/lib/atom-ternjs-helper.js
