/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

((doc) => {
  const themeColor = doc.querySelector('meta[name="theme-color"]');
  const icon = doc.querySelector('link[rel="icon"]');
  const colorScheme = doc.querySelector('meta[name="color-scheme"]');
  const body = doc.body;

  doc.addEventListener('colorschemechange', (e) => {
    themeColor.content = getComputedStyle(body).color;
    colorScheme.content = e.detail.colorScheme;
    if (e.detail.colorScheme === 'dark') {
    	$('html').addClass('dark')
    } else {
    	$('html').removeClass('dark')
    }
    //icon.href = e.detail.colorScheme === 'dark' ? 'dark-mode-toggle/moon.png' : 'dark-mode-toggle/sun.png';
  });

  doc.addEventListener('permanentcolorscheme', (e) => {
    const permanent = e.detail.permanent;
    console.log(
      `${permanent ? 'R' : 'Not r'}emembering the last selected mode.`,
    );
  });
})(document);
