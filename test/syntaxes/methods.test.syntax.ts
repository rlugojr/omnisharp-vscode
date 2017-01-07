/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Methods", () => {
        it("single-line declaration with no parameters", () => {

            const input = Input.InClass(`void Foo() { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("void"),
                Token.Identifiers.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration with two parameters", () => {

            const input = Input.InClass(`
int Add(int x, int y)
{
    return x + y;
}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("int"),
                Token.Identifiers.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.Type("int"),
                Token.Variables.Parameter("x"),
                Token.Punctuation.Comma,
                Token.Type("int"),
                Token.Variables.Parameter("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Return,
                Token.Variables.ReadWrite("x"),
                Token.Operators.Arithmetic.Addition,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("declaration in with generic constraints", () => {

            const input = Input.InClass(`TResult GetString<T, TResult>(T arg) where T : TResult { }`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("TResult"),
                Token.Identifiers.MethodName("GetString<T, TResult>"),
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Variables.Parameter("arg"),
                Token.Punctuation.CloseParen,
                Token.Keywords.Where,
                Token.Type("T"),
                Token.Punctuation.Colon,
                Token.Type("TResult"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("expression body", () => {

            const input = Input.InClass(`int Add(int x, int y) => x + y;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("int"),
                Token.Identifiers.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.Type("int"),
                Token.Variables.Parameter("x"),
                Token.Punctuation.Comma,
                Token.Type("int"),
                Token.Variables.Parameter("y"),
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Variables.ReadWrite("x"),
                Token.Operators.Arithmetic.Addition,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon]);
        });

        it("explicitly-implemented interface member", () => {

            const input = Input.InClass(`string IFoo<string>.GetString();`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("string"),
                Token.Type("IFoo"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("string"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Accessor,
                Token.Identifiers.MethodName("GetString"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface", () => {

            const input = Input.InInterface(`string GetString();`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("string"),
                Token.Identifiers.MethodName("GetString"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface with parameters", () => {

            const input = Input.InInterface(`string GetString(string format, params object[] args);`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("string"),
                Token.Identifiers.MethodName("GetString"),
                Token.Punctuation.OpenParen,
                Token.Type("string"),
                Token.Variables.Parameter("format"),
                Token.Punctuation.Comma,
                Token.Keywords.Modifiers.Params,
                Token.Type("object"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Variables.Parameter("args"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("declaration in interface with generic constraints", () => {

            const input = Input.InInterface(`TResult GetString<T, TResult>(T arg) where T : TResult;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("TResult"),
                Token.Identifiers.MethodName("GetString<T, TResult>"),
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Variables.Parameter("arg"),
                Token.Punctuation.CloseParen,
                Token.Keywords.Where,
                Token.Type("T"),
                Token.Punctuation.Colon,
                Token.Type("TResult"),
                Token.Punctuation.Semicolon]);
        });

        it("commented parameters are highlighted properly (issue #802)", () => {

            const input = Input.InClass(`public void methodWithParametersCommented(int p1, /*int p2*/, int p3) {}`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Type("void"),
                Token.Identifiers.MethodName("methodWithParametersCommented"),
                Token.Punctuation.OpenParen,
                Token.Type("int"),
                Token.Variables.Parameter("p1"),
                Token.Punctuation.Comma,
                Token.Comment.MultiLine.Start,
                Token.Comment.MultiLine.Text("int p2"),
                Token.Comment.MultiLine.End,
                Token.Punctuation.Comma,
                Token.Type("int"),
                Token.Variables.Parameter("p3"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});