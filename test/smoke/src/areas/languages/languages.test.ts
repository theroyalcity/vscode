/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join } from 'path';
import { Application, ProblemSeverity, Problems, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {
	describe.only('Language Features', () => {

		// Shared before/after handling
		installAllHandlers(logger);

		function timeout() {
			return new Promise(resolve => setTimeout(resolve, 500));
		}

		it('verifies quick outline (js)', async function () {
			const app = this.app as Application;
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'bin', 'www'));
			await timeout();

			await app.workbench.quickaccess.openQuickOutline();
			await timeout();
			await app.workbench.quickinput.waitForQuickInputElements(names => names.length >= 60);
			await timeout();
			await app.workbench.quickinput.closeQuickInput();
			await timeout();
		});

		it('verifies quick outline (css)', async function () {
			const app = this.app as Application;
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'public', 'stylesheets', 'style.css'));
			await timeout();
			await app.workbench.quickaccess.openQuickOutline();
			await timeout();
			await app.workbench.quickinput.waitForQuickInputElements(names => names.length === 2);
			await timeout();
			await app.workbench.quickinput.closeQuickInput();
			await timeout();
		});

		it('verifies problems view (css)', async function () {
			const app = this.app as Application;
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'public', 'stylesheets', 'style.css'));
			await timeout();
			await app.workbench.editor.waitForTypeInEditor('style.css', '.foo{}');
			await timeout();

			await app.code.waitForElement(Problems.getSelectorInEditor(ProblemSeverity.WARNING));
			await timeout();

			await app.workbench.problems.showProblemsView();
			await timeout();
			await app.code.waitForElement(Problems.getSelectorInProblemsView(ProblemSeverity.WARNING));
			await timeout();
			await app.workbench.problems.hideProblemsView();
			await timeout();
		});

		it('verifies settings (css)', async function () {
			const app = this.app as Application;
			await app.workbench.settingsEditor.addUserSetting('css.lint.emptyRules', '"error"');
			await timeout();
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'public', 'stylesheets', 'style.css'));
			await timeout();

			await app.code.waitForElement(Problems.getSelectorInEditor(ProblemSeverity.ERROR));
			await timeout();

			await app.workbench.problems.showProblemsView();
			await timeout();
			await app.code.waitForElement(Problems.getSelectorInProblemsView(ProblemSeverity.ERROR));
			await timeout();
			await app.workbench.problems.hideProblemsView();
			await timeout();
		});
	});
}
